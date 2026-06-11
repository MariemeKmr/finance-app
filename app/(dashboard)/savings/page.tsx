"use client";
import { useState, useEffect } from "react";

const COLORS = ["#069494", "#C48A9F", "#D4AF37", "#5B9BD5", "#8B7BB5", "#4CAF82"];

interface Saving {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

export default function SavingsPage() {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    color: "#069494",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSavings = async () => {
    const res = await fetch("/api/savings");
    const data = await res.json();
    setSavings(data);
    setLoading(false);
  };

  useEffect(() => {
    const initializeSavings = async () => {
      const res = await fetch("/api/savings");
      const data = await res.json();
      setSavings(data);
      setLoading(false);
    };

    void initializeSavings();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.targetAmount) return;
    setSubmitting(true);
    await fetch("/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "", color: "#069494" });
    setShowForm(false);
    setSubmitting(false);
    fetchSavings();
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/savings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentAmount: editAmount }),
    });
    setEditId(null);
    setEditAmount("");
    fetchSavings();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/savings/${id}`, { method: "DELETE" });
    fetchSavings();
  };

  const totalTarget = savings.reduce((s, o) => s + o.targetAmount, 0);
  const totalCurrent = savings.reduce((s, o) => s + o.currentAmount, 0);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap");
        .vault-input { background: rgba(253,251,247,0.04); border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 10px 14px; font-family: "DM Sans", sans-serif; font-size: 13px; color: #FDFBF7; outline: none; transition: border-color 0.2s; width: 100%; }
        .vault-input:focus { border-color: #069494; }
        .vault-input::placeholder { color: rgba(253,251,247,0.2); }
        .saving-card { background: rgba(253,251,247,0.02); border: 0.5px solid rgba(253,251,247,0.08); border-radius: 12px; padding: 24px; transition: all 0.3s; }
        .saving-card:hover { background: rgba(253,251,247,0.04); border-color: rgba(253,251,247,0.12); }
        .progress-bar-bg { background: rgba(253,251,247,0.06); border-radius: 100px; height: 6px; overflow: hidden; margin: 16px 0 10px; }
        .delete-btn { background: none; border: none; color: rgba(196,138,159,0.4); cursor: pointer; padding: 4px; border-radius: 4px; transition: color 0.2s; display: flex; align-items: center; }
        .delete-btn:hover { color: #C48A9F; }
      `}</style>

      <div style={{ fontFamily: "\"DM Sans\", sans-serif" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C48A9F", marginBottom: "8px" }}>Finances</p>
            <h1 style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "32px", fontWeight: 300, color: "#FDFBF7", letterSpacing: "0.06em" }}>
              Objectifs d&apos;épargne
            </h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: "#C48A9F", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>
            {showForm ? "Annuler" : "+ Nouvel objectif"}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.1)", borderRadius: "12px", padding: "24px", marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>Nouvel objectif</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Titre</label>
                <input type="text" placeholder="Voyage, voiture..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="vault-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Montant cible (FCFA)</label>
                <input type="number" placeholder="500000" value={form.targetAmount} onChange={e => setForm({ ...form, targetAmount: e.target.value })} className="vault-input" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Montant actuel (FCFA)</label>
                <input type="number" placeholder="0" value={form.currentAmount} onChange={e => setForm({ ...form, currentAmount: e.target.value })} className="vault-input" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "6px" }}>Date limite</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="vault-input" />
              </div>
            </div>

            {/* Couleur */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "10px" }}>Couleur</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "2px solid #FDFBF7" : "2px solid transparent", transition: "border 0.2s" }} />
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{ background: "#C48A9F", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Enregistrement..." : "Créer l'objectif"}
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Objectifs actifs", value: savings.length.toString(), color: "#C48A9F" },
            { label: "Total épargné", value: `${totalCurrent.toLocaleString()} FCFA`, color: "#069494" },
            { label: "Reste à atteindre", value: `${(totalTarget - totalCurrent).toLocaleString()} FCFA`, color: "#D4AF37" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "10px", padding: "16px 20px", borderTop: `2px solid ${s.color}` }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "22px", fontWeight: 300, color: "#FDFBF7" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Objectifs */}
        {loading ? (
          <p style={{ color: "rgba(253,251,247,0.2)", fontSize: "13px", textAlign: "center", padding: "40px" }}>Chargement...</p>
        ) : savings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "rgba(253,251,247,0.02)", border: "0.5px solid rgba(253,251,247,0.08)", borderRadius: "12px" }}>
            <p style={{ color: "rgba(253,251,247,0.3)", fontSize: "13px" }}>Aucun objectif d&apos;épargne — créez votre premier objectif !</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {savings.map(s => {
              const pct = Math.min(Math.round((s.currentAmount / s.targetAmount) * 100), 100);
              const remaining = s.targetAmount - s.currentAmount;

              return (
                <div key={s._id} className="saving-card" style={{ borderTop: `2px solid ${s.color}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "4px" }}>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#FDFBF7", letterSpacing: "0.04em" }}>{s.title}</p>
                    <button className="delete-btn" onClick={() => handleDelete(s._id)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>

                  {s.deadline && (
                    <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.3)", marginBottom: "4px" }}>
                      Échéance : {new Date(s.deadline).toLocaleDateString("fr-FR")}
                    </p>
                  )}

                  {/* Barre de progression */}
                  <div className="progress-bar-bg">
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: "100px", transition: "width 0.6s ease" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "20px", fontWeight: 300, color: "#FDFBF7" }}>
                      {s.currentAmount.toLocaleString()} FCFA
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: 500, color: s.color, fontFamily: "\"Cormorant Garamond\", serif" }}>
                      {pct}%
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(253,251,247,0.35)", marginBottom: "16px" }}>
                    <span>Objectif : {s.targetAmount.toLocaleString()} FCFA</span>
                    <span>Reste : {remaining.toLocaleString()} FCFA</span>
                  </div>

                  {/* Mise à jour montant */}
                  {editId === s._id ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input type="number" placeholder="Nouveau montant" value={editAmount} onChange={e => setEditAmount(e.target.value)} className="vault-input" style={{ flex: 1 }} />
                      <button onClick={() => handleUpdate(s._id)} style={{ background: s.color, border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                        Mettre à jour
                      </button>
                      <button onClick={() => setEditId(null)} style={{ background: "none", border: "0.5px solid rgba(253,251,247,0.15)", borderRadius: "6px", color: "rgba(253,251,247,0.4)", fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", padding: "8px 14px", cursor: "pointer" }}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(s._id); setEditAmount(s.currentAmount.toString()); }} style={{ background: "none", border: `0.5px solid ${s.color}`, borderRadius: "6px", color: s.color, fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
                      Mettre à jour le montant
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}