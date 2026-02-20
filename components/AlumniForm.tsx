import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { AlumniRecord, FormState } from "@/lib/types";

const FACULTY_OPTIONS = [
  "Agriculture",
  "Animal Science and Veterinary Medicine",
  "Business Administration",
  "Computer Science and Engineering",
  "Environmental Science and Disaster Management",
  "Fisheries",
  "Law and Land Administration",
  "Nutrition and Food Science",
];
const PROFESSION_OPTIONS = ["Student", "Job Holder", "Teacher"];
const UPAZILLA_OPTIONS = [
  "Assasuni",
  "Debhata",
  "Kalaroa",
  "Kaliganj",
  "Satkhira Sadar",
  "Shyamnagar",
  "Tala",
];

interface AlumniFormProps {
  initialData: FormState;
  onSubmit: (
    e: React.FormEvent,
    form: FormState,
    avatarFile: File | null
  ) => void | Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
  disabled?: boolean;
}

export default function AlumniForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  disabled = false,
}: AlumniFormProps) {
  const [form, setForm] = useState<FormState>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    setForm(initialData);
    setAvatarFile(null);
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => {
      const newState = { ...prev, [field]: value };

      if (field === "profession" && value === "Student") {
        newState.job_rank = "";
        newState.company = "";
      }

      return newState;
    });

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatarFile(file);
    if (file && file.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be less than 1MB.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    const requiredFields: (keyof FormState)[] = [
      "name",
      "faculty",
      "session",
      "upazilla",
      "profession",
    ];
    for (const field of requiredFields) {
      if (!form[field] || (form[field] as string).trim() === "") {
        newErrors[field] = "This field is required.";
      }
    }

    if (form.session && !/^\d{4}-\d{2}$/.test(form.session)) {
      newErrors.session = "Session must be in YYYY-YY format (e.g. 2019-20).";
    }

    if (form.profession === "Job Holder") {
      if (!form.job_rank) newErrors.job_rank = "Job Rank is required.";
      if (!form.company) newErrors.company = "Company is required.";
    }
    if (form.profession === "Teacher") {
      if (!form.job_rank) newErrors.job_rank = "Designation is required.";
      if (!form.company) newErrors.company = "Department is required.";
    }
    if (avatarFile && avatarFile.size > 1024 * 1024) {
      newErrors.image = "Image must be less than 1MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(e, form, avatarFile);
  };

  const renderSelect = (
    field: keyof FormState,
    options: string[],
    label: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Select
        value={(form[field] as string) || ""}
        onValueChange={(value) => handleChange(field, value)}
      >
        <SelectTrigger id={field}>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors[field] && (
        <p className="text-sm text-destructive">{errors[field]}</p>
      )}
    </div>
  );

  const renderTextInput = (
    field: keyof FormState,
    label: string,
    required: boolean = false,
    type: string = "text"
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        type={type}
        placeholder={`Enter ${label}`}
        value={(form[field] as string) || ""}
        onChange={(e) => handleChange(field, e.target.value)}
      />
      {errors[field] && (
        <p className="text-sm text-destructive">{errors[field]}</p>
      )}
    </div>
  );
  const [jobRankText, setJobRankText] = useState("");
  const [companyText, setCompanyText] = useState("");

  useEffect(() => {
    if (form.profession === "Job Holder") {
      setJobRankText("Job Rank");
      setCompanyText("Company/Organization Name");
    } else if (form.profession === "Teacher") {
      setJobRankText("Designation");
      setCompanyText("Department");
    }
  }, [form.profession]);

  const isJobHolder =
    form.profession === "Job Holder" || form.profession === "Teacher";
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Alumni Record" : "Add New Alumnus"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? `Update the details for ${initialData.name}.`
            : "Fill out the form to add a new record."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-8">
          <fieldset className="space-y-4 rounded-lg">
            <legend className="text-lg font-semibold">
              Personal & Contact Info
            </legend>
            <div className="space-y-8">
              {renderTextInput("name", "Full Name", true)}
              {renderTextInput("email", "Email Address", false, "email")}
              {renderTextInput("whatsapp", "WhatsApp Number")}
              {renderTextInput("facebook_link", "Facebook Profile Link")}
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg">
            <legend className="text-lg font-semibold">Academic Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderTextInput("session", "Academic Session (e.g. 2019-20)")}
              {renderSelect("faculty", FACULTY_OPTIONS, "Faculty/Department")}
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg">
            <legend className="text-lg font-semibold">Career & Location</legend>
            {renderSelect(
              "profession",
              PROFESSION_OPTIONS,
              "Current Profession"
            )}
            {isJobHolder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTextInput("job_rank", jobRankText, true)}
                {renderTextInput("company", companyText, true)}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelect("upazilla", UPAZILLA_OPTIONS, "Permanent Upazilla")}
              {renderTextInput("village", "Village/Area")}
            </div>
          </fieldset>

          <div className="space-y-2 pt-4">
            <Label htmlFor="image">{isEdit ? "Change Image" : "Image"}</Label>
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}

            <p className="text-xs text-muted-foreground">
              {isEdit &&
                form.image &&
                !avatarFile &&
                "Current image is set. Select a new file to replace it. "}
              <strong>Max file size is 1MB.</strong>
              <span>
                Use
                <Link
                  href={"https://www.compress2go.com"}
                  className="underline"
                >
                  compress2go.com
                </Link>
                to reduce image size.
              </span>
            </p>
          </div>
        </CardContent>

        <CardFooter className={isEdit ? "flex justify-end gap-2 mt-4" : "mt-4"}>
          {isEdit && onCancel && (
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className="my-4"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
          <Button
            type="submit"
            className={isEdit ? "" : "w-full"}
            disabled={disabled}
          >
            {isEdit ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Submit
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
