import { supabase } from "@/lib/supabaseClient";
import Hero from "@/components/Hero";
import ClientHome from "@/components/ClientHome";
import { AlumniRecord } from "@/lib/types";

export const revalidate = 10;

export default async function Home() {
  const { data } = await supabase
    .from("alumni")
    .select("*")
    .order("profession", { ascending: true });
  const alumni: AlumniRecord[] = data ?? [];

  return (
    <main>
      <Hero alumni={alumni} />
      <div className="max-w-2xl mx-auto p-6 scroll-smooth" id="alumni">
        <ClientHome initialAlumni={alumni || []} />
      </div>
    </main>
  );
}
