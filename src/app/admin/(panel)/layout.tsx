import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { auth } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 paper-wash text-ink">{children}</div>
    </div>
  );
}
