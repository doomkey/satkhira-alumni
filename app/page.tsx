import { supabase } from "@/lib/supabaseClient";
import Hero from "@/components/Hero";
import ClientHome from "@/components/ClientHome";

export const revalidate = 10;

export interface Alumni {
  id: number;
  name: string;
  session: string;
  profession: string;
  upazilla: string;
  faculty: string;
}

export default async function Home() {
  const { data: alumni } = await supabase
    .from("alumni")
    .select("*")
    .order("profession", { ascending: true });

  return (
    <main>
      <Hero alumni={alumni} />
      <div className="max-w-2xl mx-auto p-6 scroll-smooth" id="alumni">
        <ClientHome initialAlumni={alumni || []} />
      </div>
    </main>
  );
}
