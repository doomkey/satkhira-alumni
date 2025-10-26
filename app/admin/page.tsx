"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { AlumniDataTable } from "@/components/AlumniDataTable";
import AlumniForm from "@/components/AlumniForm";
import NoticeForm from "@/components/NoticeForm";
import { Session } from "@supabase/supabase-js";

import { AlumniRecord, FormState, initialAddFormState } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  UserCog,
  LogOut,
  Users,
  UserPlus,
  Home,
  Menu,
  MessageSquareText,
  BookDashed,
} from "lucide-react";
import AlumniCharts from "@/components/AlumniCharts";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);

  const [activeView, setActiveView] = useState<
    "view" | "add" | "edit" | "notices" | "dashboard"
  >("dashboard");

  const [editForm, setEditForm] = useState<FormState | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setActiveView("view");
  }

  async function handleDeleteAlumni(alumniId: string) {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from("alumni").delete().eq("id", alumniId);
      await loadAlumni();
    }
  }

  async function handlePostNotice(
    e: React.FormEvent,
    title: string,
    content: string
  ) {
    e.preventDefault();

    if (!session?.user?.id) {
      console.error("User session is missing or invalid.");
      alert("Authentication error. Please log in again.");
      return;
    }

    if (!title || !content) {
      alert("Title and content are required fields.");
      return;
    }

    const { data, error } = await supabase
      .from("notices")
      .insert([
        {
          title: title,
          content: content,
          created_by: session.user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error posting notice:", error);
      alert(`Failed to post notice: ${error.message}`);
      return;
    }

    console.log("Notice posted successfully:", data);
    alert("Notice posted successfully!");

    setActiveView("view");
  }

  function startEditing(alumnus: AlumniRecord) {
    const fullForm: FormState = { ...initialAddFormState, ...alumnus };
    setEditForm(fullForm);
    setActiveView("edit");
    setIsSidebarOpen(false);
  }

  function startAdding() {
    setActiveView("add");
    setIsSidebarOpen(false);
  }

  function startNotices() {
    setActiveView("notices");
    setIsSidebarOpen(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const NavLink = ({
    icon: Icon,
    label,
    view,
  }: {
    icon: React.ElementType;
    label: string;
    view: "view" | "add" | "notices" | "dashboard";
  }) => (
    <Button
      variant={activeView === view ? "secondary" : "ghost"}
      className="w-full justify-start"
      onClick={() => {
        setActiveView(view);
        setIsSidebarOpen(false);
      }}
    >
      <Icon className="mr-3 h-4 w-4" />
      {label}
    </Button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          Management
        </h3>
        <NavLink icon={BookDashed} label="Dashboard" view="dashboard" />
        <NavLink icon={Users} label="View Alumni" view="view" />
        <NavLink icon={UserPlus} label="Add New Alumni" view="add" />

        {activeView === "edit" && (
          <Button variant="secondary" className="w-full justify-start" disabled>
            <UserCog className="mr-3 h-4 w-4" /> Editing Record
          </Button>
        )}
      </div>
      <Separator />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          Account
        </h3>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
        >
          <LogOut className="mr-3 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "view":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Alumni Directory
              </CardTitle>
              <CardDescription>
                Browse, sort, filter, and manage all {alumni.length} alumni
                records.
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <AlumniDataTable
                data={alumni}
                onEdit={startEditing}
                onDelete={handleDeleteAlumni}
                onAddNew={startAdding}
              />
            </div>
          </Card>
        );
      case "add":
        return (
          <AlumniForm
            initialData={initialAddFormState as FormState}
            onSubmit={handleFormSubmit}
            onCancel={() => setActiveView("view")}
            isEdit={false}
          />
        );
      case "edit":
        return editForm ? (
          <AlumniForm
            initialData={editForm}
            onSubmit={handleFormSubmit}
            onCancel={() => setActiveView("view")}
            isEdit={true}
          />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Select an alumnus to edit from the "Alumni Directory" section.
          </p>
        );

      case "notices":
        return (
          <NoticeForm
            onCancel={() => setActiveView("view")}
            onSubmit={handlePostNotice}
          />
        );
      case "dashboard":
        return <AlumniCharts data={alumni} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white shadow md:hidden">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" /> SAS Admin
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <aside className="hidden w-64 border-r bg-white p-4 pt-10 md:block fixed h-full">
        <div className="flex items-center gap-2 mb-8 px-2">
          <UserCog className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">SAS Admin</h2>
        </div>
        <SidebarContent />
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className="fixed left-0 top-0 h-full w-64 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold tracking-tight">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
              >
                &times;
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 p-4 md:ml-64 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back, Admin!
            </h2>
            <p className="text-muted-foreground">
              Manage the alumni records and settings.
            </p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
