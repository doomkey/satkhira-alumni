"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AlumniCard from "@/components/AlumniCard";
import AlumniForm from "@/components/AlumniForm";
import { Session } from "@supabase/supabase-js";

import { AlumniRecord, FormState, initialAddFormState } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCog, LogOut, Users, UserPlus, Globe } from "lucide-react";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"view" | "add" | "edit">("view");

  const [editForm, setEditForm] = useState<FormState | null>(null);

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setSession(data.session);
        loadAlumni();
      }
    });
  }, [router]);

  async function loadAlumni() {
    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading alumni:", error);
      setAlumni([]);
      return;
    }

    setAlumni((data as AlumniRecord[]) || []);
  }

  async function uploadAvatar(file: File): Promise<string | null> {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("alumni-photo")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("alumni-photo")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleFormSubmit(
    e: React.FormEvent,
    form: FormState,
    avatarFile: File | null
  ) {
    e.preventDefault();

    if (!session?.user?.id) {
      console.error("User session is missing or invalid.");
      return;
    }

    let image_url: string | null = form.image || null;
    if (avatarFile) {
      const new_url = await uploadAvatar(avatarFile);
      if (new_url) {
        image_url = new_url;
      }
    }

    if (!form.name || !form.faculty || !form.session) {
      alert("Name, Faculty, and Session are required fields.");
      return;
    }

    const alumniData: FormState = { ...form, image: image_url };

    if (form.id) {
      await supabase.from("alumni").update(alumniData).eq("id", form.id);
      setEditForm(null);
    } else {
      await supabase
        .from("alumni")
        .insert([{ ...alumniData, created_by: session.user.id }]);
    }

    await loadAlumni();
    setActiveTab("view");
  }

  async function handleDeleteAlumni(alumniId: string) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from("alumni").delete().eq("id", alumniId);
      await loadAlumni();
    }
  }

  function startEditing(alumnus: AlumniRecord) {
    const fullForm: FormState = { ...initialAddFormState, ...alumnus };
    setEditForm(fullForm);
    setActiveTab("edit");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6">
      <header className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold flex items-center gap-2 ">
          <UserCog className="h-7 w-7" />
          SAS Admin
        </h1>
        <Button onClick={logout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "view" | "add" | "edit")
        }
        className="w-full"
      >
        <TabsList className="w-full mx-auto">
          <TabsTrigger value="view">
            <Users className="mr-2 h-4 w-4" /> View Alumni
          </TabsTrigger>
          <TabsTrigger value="add">
            <UserPlus className="mr-2 h-4 w-4" /> Add New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Directory</CardTitle>
              <CardDescription>
                Browse and manage the alumni directory ({alumni.length}{" "}
                records).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alumni.length > 0 ? (
                alumni.map((a) => (
                  <AlumniCard
                    key={a.id}
                    alumni={a} // 'a' is AlumniRecord
                    onEdit={startEditing} // expects AlumniRecord
                    onDelete={handleDeleteAlumni}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  <Globe className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  No alumni records found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <AlumniForm
            initialData={initialAddFormState as FormState}
            onSubmit={handleFormSubmit}
            isEdit={false}
          />
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          {editForm ? (
            <AlumniForm
              initialData={editForm}
              onSubmit={handleFormSubmit}
              onCancel={() => setActiveTab("view")}
              isEdit={true}
            />
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Select an alumnus to edit from the "View Alumni" tab.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
