import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import StatCard from "@/components/ui/StatCard";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#069494", marginBottom: "8px" }}>
          Tableau de bord
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 300, color: "#FDFBF7", letterSpacing: "0.06em" }}>
          Bonjour, {session.user?.name?.split(" ")[0]}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(253,251,247,0.08)" }}/>
          <div style={{ width: "5px", height: "5px", background: "#D4AF37", transform: "rotate(45deg)" }}/>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(253,251,247,0.08)" }}/>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
        <StatCard label="Solde total" value="0 FCFA" sub="Ce mois-ci" color="#069494" />
        <StatCard label="Revenus" value="0 FCFA" sub="Ce mois-ci" color="#D4AF37" />
        <StatCard label="Dépenses" value="0 FCFA" sub="Ce mois-ci" color="#C48A9F" />
        <StatCard label="Épargne" value="0 FCFA" sub="Objectifs en cours" color="#069494" />
      </div>

      {/* Placeholder graphiques */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "10px", padding: "24px", minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.3)", marginBottom: "8px" }}>Dépenses par catégorie</p>
          <p style={{ color: "rgba(253,251,247,0.15)", fontSize: "13px" }}>Ajoutez des transactions pour voir le graphique</p>
        </div>
        <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "10px", padding: "24px", minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.3)", marginBottom: "8px" }}>Revenus vs Dépenses</p>
          <p style={{ color: "rgba(253,251,247,0.15)", fontSize: "13px" }}>Ajoutez des transactions pour voir le graphique</p>
        </div>
      </div>
    </div>
  );
}