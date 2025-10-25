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

import { AlumniRecord, FormState } from "@/lib/types";

const SESSION_OPTIONS = [
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
  "2018-19",
  "2017-18",
  "2016-17",
  "2015-16",
  "2014-15",
  "2013-14",
  "2012-13",
  "2011-12",
  "2010-11",
];
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
const PROFESSION_OPTIONS = ["Student", "Job Holder"];
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
}

export default function AlumniForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: AlumniFormProps) {
  const [form, setForm] = useState<FormState>(initialData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(initialData);
    setAvatarFile(null);
  }, [initialData]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => {
      const newState = { ...prev, [field]: value };

      if (field === "profession" && value !== "Job Holder") {
        newState.job_rank = "";
        newState.company = "";
      }

      return newState;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarFile(e.target.files ? e.target.files[0] : null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.faculty || !form.session) {
      alert("Name, Faculty, and Session are required.");
      return;
    }

    if (form.profession === "Job Holder" && (!form.job_rank || !form.company)) {
      alert("Job Rank and Company are required for Job Holders.");
      return;
    }

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
        required={
          field === "session" || field === "faculty" || field === "profession"
        }
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
        required={required}
      />
    </div>
  );

  const isJobHolder = form.profession === "Job Holder";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Alumni Record" : "Add New Alumni"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? `Update the details for ${initialData.name}.`
            : "Fill out the form to add a new record."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-8">
          <fieldset className="space-y-4 border p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">
              Personal & Contact Info
            </legend>
            <div className="space-y-8">
              {renderTextInput("name", "Full Name", true)}
              {renderTextInput("email", "Email Address", false, "email")}
              {renderTextInput("whatsapp", "WhatsApp Number")}
              {renderTextInput("facebook_link", "Facebook Profile Link")}
            </div>
          </fieldset>
          <fieldset className="space-y-4 border p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">
              Academic Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderTextInput("session", "Academic Session (e.g. 2019-20)")}
              {renderSelect("faculty", FACULTY_OPTIONS, "Faculty/Department")}
            </div>
          </fieldset>
          <fieldset className="space-y-4 border p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">
              Career & Location
            </legend>
            {renderSelect(
              "profession",
              PROFESSION_OPTIONS,
              "Current Profession"
            )}
            {isJobHolder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTextInput("job_rank", "Job Rank/Title", true)}
                {renderTextInput("company", "Company/Organization Name", true)}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelect("upazilla", UPAZILLA_OPTIONS, "Permanent Upazilla")}
              {renderTextInput("village", "Village/Area")}
            </div>
          </fieldset>
          <div className="space-y-2 pt-4">
            <Label htmlFor="image">{isEdit ? "Change Avatar" : "Avatar"}</Label>
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {isEdit && form.image && !avatarFile && (
              <p className="text-xs text-muted-foreground">
                Current image is set. Select a new file to replace it.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className={isEdit ? "flex justify-end gap-2" : ""}>
          {isEdit && onCancel && (
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className=" my-4"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
          <Button type="submit" className={isEdit ? "" : "w-full"}>
            {isEdit ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Add Alumni
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
