import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { getSession } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main className="flex-1 overflow-auto" style={{ backgroundColor: "#f7f4ed" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #eceae4" }}>
          <SidebarTrigger />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
