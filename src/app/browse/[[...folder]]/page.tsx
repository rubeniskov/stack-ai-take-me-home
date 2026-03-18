import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FilePicker } from "@/components/file-picker";

export default async function BrowsePage(props: {
  params: Promise<{ folder?: string[] }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="bg-muted/20">
      <main className="mx-auto p-6 md:p-8 space-y-8">
        <div className="grid gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Google Drive Connection</h3>
            </div>
            <FilePicker />
          </section>
        </div>
      </main>
    </div>
  );
}
