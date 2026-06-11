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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Charges fixes",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      await fetchTransactions();
    };
    loadTransactions();
  }, []);

  const handleSubmit = async () => {
    if (!form.amount || !form.category) return;
    setSubmitting(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ type: "expense", amount: "", category: "Charges fixes", description: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    setSubmitting(false);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  const filtered = transactions.filter(t => filter === "all" ? true : t.type === filter);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

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
        .delete-btn { background: none; border: none; color: rgba(196,138,159,0.4); cursor: pointer; padding: 4px; border-radius: 4px; transition: color 0.2s; display: flex; align-items: center; }
        .delete-btn:hover { color: #C48A9F; }
        .tx-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 0.5px solid rgba(253,251,247,0.05); transition: background 0.2s; }
        .tx-row:hover { background: rgba(253,251,247,0.02); }
        .tx-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{fontFamily:"\"DM Sans\", sans-serif"}}>

        {/* Header */}
        <div style={{marginBottom:"32px", display:"flex", alignItems:"flex-start", justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#069494", marginBottom:"8px"}}>Finances</p>
            <h1 style={{fontFamily:"\"Cormorant Garamond\", serif", fontSize:"32px", fontWeight:300, color:"#FDFBF7", letterSpacing:"0.06em"}}>Transactions</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{background:"#069494", border:"none", borderRadius:"6px", color:"#FDFBF7", fontFamily:"\"DM Sans\", sans-serif", fontSize:"12px", letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 20px", cursor:"pointer"}}>
            {showForm ? "Annuler" : "+ Ajouter"}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={{background:"rgba(253,251,247,0.03)", border:"0.5px solid rgba(253,251,247,0.1)", borderRadius:"12px", padding:"24px", marginBottom:"28px"}}>
            <p style={{fontSize:"10px", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"20px"}}>Nouvelle transaction</p>

            {/* Type */}
            <div style={{display:"flex", gap:"10px", marginBottom:"16px"}}>
              {["expense", "income"].map(t => (
                <button key={t} onClick={() => setForm({...form, type: t, category: t === "expense" ? "Charges fixes" : "Salaire"})}
                  style={{flex:1, padding:"10px", border:`0.5px solid ${form.type === t ? (t === "expense" ? "#C48A9F" : "#069494") : "rgba(253,251,247,0.1)"}`, borderRadius:"6px", background: form.type === t ? (t === "expense" ? "rgba(196,138,159,0.1)" : "rgba(6,148,148,0.1)") : "none", color: form.type === t ? (t === "expense" ? "#C48A9F" : "#069494") : "rgba(253,251,247,0.4)", fontFamily:"\"DM Sans\", sans-serif", fontSize:"12px", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer"}}>
                  {t === "expense" ? "Dépense" : "Revenu"}
                </button>
              ))}
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px"}}>
              <div>
                <label style={{display:"block", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"6px"}}>Montant (FCFA)</label>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="vault-input" />
              </div>
              <div>
                <label style={{display:"block", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"6px"}}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="vault-input" />
              </div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px"}}>
              <div>
                <label style={{display:"block", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"6px"}}>Catégorie</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="vault-select">
                  {(form.type === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{display:"block", fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"6px"}}>Description</label>
                <input type="text" placeholder="Loyer, courses..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="vault-input" />
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{background:"#069494", border:"none", borderRadius:"6px", color:"#FDFBF7", fontFamily:"\"DM Sans\", sans-serif", fontSize:"12px", letterSpacing:"0.12em", textTransform:"uppercase", padding:"12px 28px", cursor:"pointer", opacity: submitting ? 0.6 : 1}}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        )}

        {/* Stats rapides */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"14px", marginBottom:"28px"}}>
          {[
            {label:"Total transactions", value: transactions.length.toString(), color:"#069494"},
            {label:"Total revenus", value: `+${totalIncome.toLocaleString()} FCFA`, color:"#069494"},
            {label:"Total dépenses", value: `-${totalExpense.toLocaleString()} FCFA`, color:"#C48A9F"},
          ].map(s => (
            <div key={s.label} style={{background:"rgba(253,251,247,0.03)", border:"0.5px solid rgba(253,251,247,0.08)", borderRadius:"10px", padding:"16px 20px", borderTop:`2px solid ${s.color}`}}>
              <p style={{fontSize:"10px", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(253,251,247,0.4)", marginBottom:"8px"}}>{s.label}</p>
              <p style={{fontFamily:"\"Cormorant Garamond\", serif", fontSize:"22px", fontWeight:300, color:"#FDFBF7"}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{display:"flex", gap:"8px", marginBottom:"20px"}}>
          {(["all", "income", "expense"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? "active" : ""}`}>
              {f === "all" ? "Tout" : f === "income" ? "Revenus" : "Dépenses"}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div style={{background:"rgba(253,251,247,0.02)", border:"0.5px solid rgba(253,251,247,0.08)", borderRadius:"12px", overflow:"hidden"}}>
          {loading ? (
            <p style={{textAlign:"center", padding:"40px", color:"rgba(253,251,247,0.3)", fontSize:"13px"}}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <p style={{textAlign:"center", padding:"40px", color:"rgba(253,251,247,0.3)", fontSize:"13px"}}>Aucune transaction</p>
          ) : (
            filtered.map(t => (
              <div key={t._id} className="tx-row">
                <div style={{display:"flex", alignItems:"center", gap:"14px"}}>
                  {/* Indicateur catégorie */}
                  <div style={{width:"3px", height:"36px", borderRadius:"2px", background: CATEGORY_COLORS[t.category] || "#888", flexShrink:0}}/>
                  <div>
                    <p style={{fontSize:"13px", fontWeight:500, color:"#FDFBF7", marginBottom:"3px"}}>{t.description || t.category}</p>
                    <p style={{fontSize:"11px", color:"rgba(253,251,247,0.35)", letterSpacing:"0.06em"}}>
                      {t.category} — {new Date(t.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:"20px"}}>
                  <p style={{fontSize:"15px", fontFamily:"\"Cormorant Garamond\", serif", fontWeight:400, color: t.type === "income" ? "#069494" : "#C48A9F"}}>
                    {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} FCFA
                  </p>
                  <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}