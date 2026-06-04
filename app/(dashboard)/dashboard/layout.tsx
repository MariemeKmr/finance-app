import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", background: "#0A1110", fontFamily: "var(--font-body)" }}>
      <Navbar />
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>
    </div>
  );
}