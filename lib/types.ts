export const initialAddFormState = {
  name: "",
  session: "",
  faculty: "",
  email: "",
  profession: "",
  upazilla: "",
  village: "",
  job_rank: "",
  company: "",
  whatsapp: "",
  facebook_link: "",
};

export type AlumniBase = typeof initialAddFormState;

export type FormState = AlumniBase & {
  id?: string;
  image?: string | null;
  created_by?: string | null;
};

export type AlumniRecord = AlumniBase & {
  id: string;
  image: string | null;
  created_by: string | null;
  created_at: string;
};
