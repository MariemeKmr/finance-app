import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
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