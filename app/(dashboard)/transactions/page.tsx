"use client";
import { useState, useEffect } from "react";

const CATEGORIES_EXPENSE = ["Charges fixes", "Alimentation", "Transport", "Santé", "Loisirs", "Épargne", "Autres"];
const CATEGORIES_INCOME = ["Salaire", "Freelance", "Autres"];

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

interface RecurringCharge {
  _id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  dayOfMonth: number;
  active: boolean;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"transactions" | "recurring">("transactions");
  const [showForm, setShowForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [editRecurring, setEditRecurring] = useState<RecurringCharge | null>(null);

  const [form, setForm] = useState({
    type: "expense", amount: "", category: "Charges fixes", description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [recurringForm, setRecurringForm] = useState({
    title: "", amount: "", category: "Charges fixes", description: "", dayOfMonth: "1",
  });

  const fetchAll = async () => {
    const [txRes, recRes] = await Promise.all([
      fetch("/api/transactions"),
      fetch("/api/recurring"),
    ]);
    setTransactions(await txRes.json());
    setRecurring(await recRes.json());
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmitTx = async () => {
    if (!form.amount || !form.category) return;
    const url = editTx ? `/api/transactions/${editTx._id}` : "/api/transactions";
    const method = editTx ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ type: "expense", amount: "", category: "Charges fixes", description: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    setEditTx(null);
    fetchAll();
  };

  const handleDeleteTx = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const handleEditTx = (t: Transaction) => {
    setEditTx(t);
    setForm({
      type: t.type, amount: t.amount.toString(), category: t.category,
      description: t.description, date: t.date.split("T")[0],
    });
    setShowForm(true);
    setTab("transactions");
  };

  const handleSubmitRecurring = async () => {
    if (!recurringForm.title || !recurringForm.amount) return;
    const url = editRecurring ? `/api/recurring/${editRecurring._id}` : "/api/recurring";
    const method = editRecurring ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recurringForm),
    });
    setRecurringForm({ title: "", amount: "", category: "Charges fixes", description: "", dayOfMonth: "1" });
    setShowRecurringForm(false);
    setEditRecurring(null);
    fetchAll();
  };

  const handleEditRecurring = (r: RecurringCharge) => {
    setEditRecurring(r);
    setRecurringForm({
      title: r.title, amount: r.amount.toString(), category: r.category,
      description: r.description, dayOfMonth: r.dayOfMonth.toString(),
    });
    setShowRecurringForm(true);
  };

  const handleDeleteRecurring = async (id: string) => {
    await fetch(`/api/recurring/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const handleApplyRecurring = async (r: RecurringCharge) => {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "expense", amount: r.amount, category: r.category,
        description: r.title, date: new Date().toISOString().split("T")[0],
      }),
    });
    fetchAll();
    setTab("transactions");
  };

  const filtered = transactions.filter(t => filter === "all" ? true : t.type === filter);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalRecurring = recurring.reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap");
        .vault-input { background: rgba(253,251,247,0.04); border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 10px 14px; font-family: "DM Sans", sans-serif; font-size: 13px; color: #FDFBF7; outline: none; transition: border-color 0.2s; width: 100%; }
        .vault-input:focus { border-color: #069494; }
        .vault-input::placeholder { color: rgba(253,251,247,0.2); }
        .vault-select { background: #0f1f1e; border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 10px 14px; font-family: "DM Sans", sans-serif; font-size: 13px; color: #FDFBF7; outline: none; width: 100%; }
        .filter-btn { background: none; border: 0.5px solid rgba(253,251,247,0.12); border-radius: 6px; color: rgba(253,251,247,0.4); font-family: "DM Sans", sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 7px 16px; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active { border-color: #069494; color: #069494; }
        .tab-btn { background: none; border: none; border-bottom: 1.5px solid transparent; color: rgba(253,251,247,0.35); font-family: "DM Sans", sans-serif; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; padding: 10px 4px; cursor: pointer; transition: all 0.2s; margin-right: 24px; }
        .tab-btn.active { color: #069494; border-bottom-color: #069494; }
        .icon-btn { background: none; border: none; cursor: pointer; padding: 5px; border-radius: 4px; display: flex; align-items: center; transition: opacity 0.2s; opacity: 0.4; }
        .icon-btn:hover { opacity: 1; }
        .icon-btn.edit { color: #D4AF37; }
        .icon-btn.delete { color: #C48A9F; }
        .tx-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 0.5px solid rgba(253,251,247,0.05); transition: background 0.2s; }
        .tx-row:hover { background: rgba(253,251,247,0.02); }
        .tx-row:last-child { border-bottom: none; }
        .apply-btn { background: none; border: 0.5px solid rgba(6,148,148,0.3); border-radius: 4px; color: #069494; font-family: "DM Sans", sans-serif; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .apply-btn:hover { background: rgba(6,148,148,0.1); border-color: #069494; }
      `}</style>

      <div style={{ fontFamily: "\"DM Sans\", sans-serif" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#069494", marginBottom: "8px" }}>Finances</p>
            <h1 style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "32px", fontWeight: 300, color: "#FDFBF7", letterSpacing: "0.06em" }}>Transactions</h1>
          </div>
          <button
            onClick={() => { tab === "transactions" ? setShowForm(!showForm) : setShowRecurringForm(!showRecurringForm); setEditTx(null); setEditRecurring(null); }}
            style={{ background: tab === "recurring" ? "#D4AF37" : "#069494", border: "none", borderRadius: "6px", color: tab === "recurring" ? "#0A1110" : "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>
            {(tab === "transactions" ? showForm : showRecurringForm) ? "Annuler" : tab === "recurring" ? "+ Charge fixe" : "+ Ajouter"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: "0.5px solid rgba(253,251,247,0.08)", marginBottom: "24px" }}>
          <button className={`tab-btn ${tab === "transactions" ? "active" : ""}`} onClick={() => setTab("transactions")}>Transactions</button>
          <button className={`tab-btn ${tab === "recurring" ? "active" : ""}`} onClick={() => setTab("recurring")}>
            Charges fixes {recurring.length > 0 && <span style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37", borderRadius: "10px", padding: "1px 7px", fontSize: "10px", marginLeft: "6px" }}>{recurring.length}</span>}
          </button>
        </div>

        {/* ===== TAB TRANSACTIONS ===== */}
        {tab === "transactions" && (
          <>
            {showForm && (
              <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.1)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>
                  {editTx ? "Modifier la transaction" : "Nouvelle transaction"}
                </p>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  {["expense", "income"].map(t => (
                    <button key={t} onClick={() => setForm({ ...form, type: t, category: t === "expense" ? "Charges fixes" : "Salaire" })}
                      style={{ flex: 1, padding: "10px", border: `0.5px solid ${form.type === t ? (t === "expense" ? "#C48A9F" : "#069494") : "rgba(253,251,247,0.1)"}`, borderRadius: "6px", background: form.type === t ? (t === "expense" ? "rgba(196,138,159,0.1)" : "rgba(6,148,148,0.1)") : "none", color: form.type === t ? (t === "expense" ? "#C48A9F" : "#069494") : "rgba(253,251,247,0.4)", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                      {t === "expense" ? "Dépense" : "Revenu"}
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Montant (FCFA)</label>
                    <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="vault-input" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="vault-input" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Catégorie</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="vault-select">
                      {(form.type === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Description</label>
                    <input type="text" placeholder="Loyer, courses..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="vault-input" />
                  </div>
                </div>
                <button onClick={handleSubmitTx} style={{ background: "#069494", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer" }}>
                  {editTx ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
              {[
                { label: "Total transactions", value: transactions.length.toString(), color: "#069494" },
                { label: "Total revenus", value: `+${totalIncome.toLocaleString()} FCFA`, color: "#069494" },
                { label: "Total dépenses", value: `-${totalExpense.toLocaleString()} FCFA`, color: "#C48A9F" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "10px", padding: "16px 20px", borderTop: `2px solid ${s.color}` }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "8px" }}>{s.label}</p>
                  <p style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "22px", fontWeight: 300, color: "#FDFBF7" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filtres */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {(["all", "income", "expense"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? "active" : ""}`}>
                  {f === "all" ? "Tout" : f === "income" ? "Revenus" : "Dépenses"}
                </button>
              ))}
            </div>

            {/* Liste transactions */}
            <div style={{ background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px", overflow: "hidden" }}>
              {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "rgba(253,251,247,0.3)", fontSize: "13px" }}>Chargement...</p>
              ) : filtered.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", color: "rgba(253,251,247,0.3)", fontSize: "13px" }}>Aucune transaction</p>
              ) : filtered.map(t => (
                <div key={t._id} className="tx-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "3px", height: "36px", borderRadius: "2px", background: CATEGORY_COLORS[t.category] || "#888", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#FDFBF7", marginBottom: "3px" }}>{t.description || t.category}</p>
                      <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.35)" }}>{t.category} — {new Date(t.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <p style={{ fontSize: "15px", fontFamily: "\"Cormorant Garamond\", serif", color: t.type === "income" ? "#069494" : "#C48A9F" }}>
                      {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} FCFA
                    </p>
                    <button className="icon-btn edit" onClick={() => handleEditTx(t)} title="Modifier">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDeleteTx(t._id)} title="Supprimer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== TAB CHARGES FIXES ===== */}
        {tab === "recurring" && (
          <>
            {showRecurringForm && (
              <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.1)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>
                  {editRecurring ? "Modifier la charge" : "Nouvelle charge fixe"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Titre</label>
                    <input type="text" placeholder="Loyer, internet..." value={recurringForm.title} onChange={e => setRecurringForm({ ...recurringForm, title: e.target.value })} className="vault-input" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Montant (FCFA)</label>
                    <input type="number" placeholder="500000" value={recurringForm.amount} onChange={e => setRecurringForm({ ...recurringForm, amount: e.target.value })} className="vault-input" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Catégorie</label>
                    <select value={recurringForm.category} onChange={e => setRecurringForm({ ...recurringForm, category: e.target.value })} className="vault-select">
                      {CATEGORIES_EXPENSE.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Jour du mois</label>
                    <input type="number" min="1" max="31" placeholder="1" value={recurringForm.dayOfMonth} onChange={e => setRecurringForm({ ...recurringForm, dayOfMonth: e.target.value })} className="vault-input" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Description</label>
                    <input type="text" placeholder="Détail..." value={recurringForm.description} onChange={e => setRecurringForm({ ...recurringForm, description: e.target.value })} className="vault-input" />
                  </div>
                </div>
                <button onClick={handleSubmitRecurring} style={{ background: "#D4AF37", border: "none", borderRadius: "6px", color: "#0A1110", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer", fontWeight: 500 }}>
                  {editRecurring ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            )}

            {/* Stat charges fixes */}
            <div style={{ background: "rgba(212,175,55,0.06)", border: "0.5px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "4px" }}>Total charges fixes mensuelles</p>
                <p style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "28px", fontWeight: 300, color: "#D4AF37" }}>{totalRecurring.toLocaleString()} FCFA</p>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(253,251,247,0.3)", textAlign: "right" }}>
                {recurring.length} charge{recurring.length > 1 ? "s" : ""} enregistrée{recurring.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Liste charges fixes */}
            <div style={{ background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px", overflow: "hidden" }}>
              {recurring.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", color: "rgba(253,251,247,0.3)", fontSize: "13px" }}>
                  Aucune charge fixe — ajoutez votre loyer, internet, abonnements...
                </p>
              ) : recurring.map(r => (
                <div key={r._id} className="tx-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "3px", height: "36px", borderRadius: "2px", background: CATEGORY_COLORS[r.category] || "#888", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#FDFBF7", marginBottom: "3px" }}>{r.title}</p>
                      <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.35)" }}>
                        {r.category} — le {r.dayOfMonth} du mois
                        {r.description && ` — ${r.description}`}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <p style={{ fontSize: "15px", fontFamily: "\"Cormorant Garamond\", serif", color: "#D4AF37" }}>
                      -{r.amount.toLocaleString()} FCFA
                    </p>
                    <button className="apply-btn" onClick={() => handleApplyRecurring(r)} title="Enregistrer comme transaction ce mois">
                      Appliquer
                    </button>
                    <button className="icon-btn edit" onClick={() => handleEditRecurring(r)} title="Modifier">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDeleteRecurring(r._id)} title="Supprimer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}