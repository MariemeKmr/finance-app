"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  "Charges fixes": "#069494",
  "Alimentation": "#C48A9F",
  "Transport": "#D4AF37",
  "Santé": "#5B9BD5",
  "Loisirs": "#8B7BB5",
  "Épargne": "#4CAF82",
  "Salaire": "#069494",
  "Freelance": "#D4AF37",
  "Autres": "#888",
};

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TooltipPayload {
  name?: string;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0f1f1e", border: "0.5px solid rgba(253,251,247,0.15)", borderRadius: "8px", padding: "10px 14px" }}>
        <p style={{ fontSize: "12px", color: "#FDFBF7", fontWeight: 500 }}>{payload[0].name}</p>
        <p style={{ fontSize: "13px", color: "#D4AF37" }}>{(payload[0].value ?? 0).toLocaleString()} FCFA</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then(r => r.json())
      .then(data => { setTransactions(data); setLoading(false); });
  }, []);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Pie chart data — dépenses par catégorie
  const expenseByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Bar chart — revenus vs dépenses par mois
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString("fr-FR", { month: "short" });
    if (!acc[month]) acc[month] = { month, revenus: 0, depenses: 0 };
    if (t.type === "income") acc[month].revenus += t.amount;
    else acc[month].depenses += t.amount;
    return acc;
  }, {} as Record<string, { month: string; revenus: number; depenses: number }>);

  const barData = Object.values(monthlyData);

  // Dernières transactions
  const recent = transactions.slice(0, 5);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap");
      `}</style>

      <div style={{ fontFamily: "\"DM Sans\", sans-serif" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#069494", marginBottom: "8px" }}>Tableau de bord</p>
          <h1 style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "32px", fontWeight: 300, color: "#FDFBF7", letterSpacing: "0.06em" }}>
            Vue d&apos;ensemble
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(253,251,247,0.08)" }} />
            <div style={{ width: "5px", height: "5px", background: "#D4AF37", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: "0.5px", background: "rgba(253,251,247,0.08)" }} />
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Solde total", value: `${balance.toLocaleString()} FCFA`, color: balance >= 0 ? "#069494" : "#C48A9F" },
            { label: "Revenus du mois", value: `+${totalIncome.toLocaleString()} FCFA`, color: "#069494" },
            { label: "Dépenses du mois", value: `-${totalExpense.toLocaleString()} FCFA`, color: "#C48A9F" },
            { label: "Transactions", value: transactions.length.toString(), color: "#D4AF37" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "10px", padding: "20px 24px", borderTop: `2px solid ${s.color}` }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "10px" }}>{s.label}</p>
              <p style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "24px", fontWeight: 300, color: "#FDFBF7" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>

          {/* Pie chart */}
          <div style={{ background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px", padding: "24px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>Répartition des dépenses</p>
            {pieData.length === 0 ? (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "rgba(253,251,247,0.2)", fontSize: "13px" }}>Aucune dépense enregistrée</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[entry.name] || "#888"} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Légende */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                  {pieData.map((entry, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLORS[entry.name] || "#888", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: "rgba(253,251,247,0.5)" }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bar chart */}
          <div style={{ background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px", padding: "24px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>Revenus vs Dépenses</p>
            {barData.length === 0 ? (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "rgba(253,251,247,0.2)", fontSize: "13px" }}>Aucune donnée disponible</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid stroke="rgba(253,251,247,0.05)" strokeDasharray="" />                  <XAxis dataKey="month" tick={{ fill: "rgba(253,251,247,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(253,251,247,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
                  <Bar dataKey="revenus" fill="#069494" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" fill="#C48A9F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Transactions récentes */}
        <div style={{ background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px", padding: "24px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>Transactions récentes</p>
          {loading ? (
            <p style={{ color: "rgba(253,251,247,0.2)", fontSize: "13px", textAlign: "center", padding: "20px" }}>Chargement...</p>
          ) : recent.length === 0 ? (
            <p style={{ color: "rgba(253,251,247,0.2)", fontSize: "13px", textAlign: "center", padding: "20px" }}>Aucune transaction</p>
          ) : (
            recent.map(t => (
              <div key={t._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "0.5px solid rgba(253,251,247,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "3px", height: "32px", borderRadius: "2px", background: CATEGORY_COLORS[t.category] || "#888" }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#FDFBF7", marginBottom: "2px" }}>{t.description || t.category}</p>
                    <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.35)" }}>{t.category} — {new Date(t.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "16px", color: t.type === "income" ? "#069494" : "#C48A9F" }}>
                  {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} FCFA
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}