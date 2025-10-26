"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import AlumniForm from "@/components/AlumniForm";
import { FormState } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const initialFormState: FormState = {
  name: "",
  email: "",
  whatsapp: "",
  facebook_link: "",
  session: "",
  faculty: "",
  profession: "",
  job_rank: "",
  company: "",
  upazilla: "",
  village: "",
  image: "",
};

export default function SubmitDataPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [step, setStep] = useState<"form" | "review" | "done">("form");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const alreadySubmitted = localStorage.getItem("alumni_form_submitted");
    if (alreadySubmitted === "true") {
      setStep("done");
      setFormSubmitted(true);
    }
  }, []);

  const handleFormNext = (
    e: React.FormEvent,
    form: FormState,
    file: File | null
  ) => {
    e.preventDefault();
    setFormData(form);
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }

    setStep("review");
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      let imageUrl = "";

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("pending_alumni_photo")
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("pending_alumni_photo")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("pending_alumni").insert([
        {
          ...formData,
          image: imageUrl,
          is_confirmed: false,
        },
      ]);

      if (error) throw error;

      localStorage.setItem("alumni_form_submitted", "true");
      setStep("done");
      setFormSubmitted(true);
      toast.success("✅ Thank you! Your data has been submitted.");
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("alumni_form_submitted");
    setFormSubmitted(false);
    setFormData(initialFormState);
    setAvatarFile(null);
    setAvatarPreview(null);
    setStep("form");
    toast("🔁 Form reset for testing");
  };

  return (
    <div className="max-w-2xl mx-auto my-10 space-y-6">
      {step === "form" && (
        <>
          <AlumniForm
            initialData={formData}
            onSubmit={handleFormNext}
            isEdit={false}
            disabled={submitting}
          />
        </>
      )}

      {step === "review" && (
        <Card className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-center">Review Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {avatarPreview && (
              <div className="flex justify-center mb-2">
                <Avatar className="h-20 w-20 border border-blue-300">
                  <AvatarImage src={avatarPreview} alt={formData.name} />
                  <AvatarFallback>
                    {formData.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <div className="space-y-2">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="font-medium capitalize">
                    {key.replace("_", " ")}:
                  </span>
                  <span className="text-muted-foreground text-right break-all">
                    {value ? value : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={submitting}
              >
                ✏️ Edit
              </Button>
              <Button onClick={handleFinalSubmit} disabled={submitting}>
                ✅ Confirm & Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6 text-center text-green-700 dark:text-green-300 font-medium space-y-3">
            <p>✅ Your information has been successfully submitted!</p>
            <p>Our team will review and confirm it soon.</p>

            {process.env.NODE_ENV === "development" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mt-3"
              >
                🔁 Reset (For Testing)
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
