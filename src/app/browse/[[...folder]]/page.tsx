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

  // Get current connection and folder ID from path if present
  // URL structure: /browse/[connectionId]/[resourceId]
  const connectionId = params.folder?.[0];
  const resourceId = params.folder?.[1];

  return (
    <div className="bg-muted/20">
      <main className="mx-auto p-6 md:p-8 space-y-8">
        <div className="grid gap-8">
          <section className="space-y-4">
            <FilePicker
              initialConnectionId={connectionId}
              initialFolderId={resourceId}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
