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
  const [editSaving, setEditSaving] = useState<Saving | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState<"add" | "subtract">("add");
  const [updateAmount, setUpdateAmount] = useState("");

  const [form, setForm] = useState({
    title: "", targetAmount: "", currentAmount: "", deadline: "", color: "#069494",
  });

  const fetchSavings = async () => {
    const res = await fetch("/api/savings");
    setSavings(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchSavings(); }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.targetAmount) return;
    const url = editSaving ? `/api/savings/${editSaving._id}` : "/api/savings";
    const method = editSaving ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "", color: "#069494" });
    setShowForm(false);
    setEditSaving(null);
    fetchSavings();
  };

  const handleUpdate = async (saving: Saving) => {
    if (!updateAmount) return;
    const delta = Number(updateAmount);
    const newAmount = updateMode === "add"
      ? saving.currentAmount + delta
      : Math.max(0, saving.currentAmount - delta);

    await fetch(`/api/savings/${saving._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentAmount: newAmount }),
    });
    setUpdateId(null);
    setUpdateAmount("");
    fetchSavings();
  };

  const handleEdit = (s: Saving) => {
    setEditSaving(s);
    setForm({
      title: s.title, targetAmount: s.targetAmount.toString(),
      currentAmount: s.currentAmount.toString(),
      deadline: s.deadline ? s.deadline.split("T")[0] : "",
      color: s.color,
    });
    setShowForm(true);
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
        .vault-select { background: #0f1f1e; border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 10px 14px; font-family: "DM Sans", sans-serif; font-size: 13px; color: #FDFBF7; outline: none; width: 100%; }
        .saving-card { background: rgba(253,251,247,0.02); border: 0.5px solid rgba(253,251,247,0.08); border-radius: 12px; padding: 24px; transition: all 0.3s; }
        .saving-card:hover { border-color: rgba(253,251,247,0.12); }
        .progress-bar-bg { background: rgba(253,251,247,0.06); border-radius: 100px; height: 6px; overflow: hidden; margin: 14px 0 10px; }
        .icon-btn { background: none; border: none; cursor: pointer; padding: 5px; border-radius: 4px; display: flex; align-items: center; transition: opacity 0.2s; opacity: 0.4; }
        .icon-btn:hover { opacity: 1; }
        .icon-btn.edit { color: #D4AF37; }
        .icon-btn.delete { color: #C48A9F; }
        .mode-btn { flex: 1; padding: 8px; border-radius: 6px; font-family: "DM Sans", sans-serif; font-size: 12px; letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s; border: 0.5px solid rgba(253,251,247,0.1); background: none; color: rgba(253,251,247,0.4); }
        .mode-btn.add.active { background: rgba(6,148,148,0.15); border-color: #069494; color: #069494; }
        .mode-btn.sub.active { background: rgba(196,138,159,0.15); border-color: #C48A9F; color: #C48A9F; }
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
          <button onClick={() => { setShowForm(!showForm); setEditSaving(null); setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "", color: "#069494" }); }}
            style={{ background: "#C48A9F", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer" }}>
            {showForm ? "Annuler" : "+ Nouvel objectif"}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={{ background: "rgba(253,251,247,0.03)", border: "0.5px solid rgba(253,251,247,0.1)", borderRadius: "12px", padding: "24px", marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "20px" }}>
              {editSaving ? "Modifier l'objectif" : "Nouvel objectif"}
            </p>
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
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "10px" }}>Couleur</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm({ ...form, color: c })}
                    style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "2px solid #FDFBF7" : "2px solid transparent", transition: "border 0.2s" }} />
                ))}
              </div>
            </div>
            <button onClick={handleSubmit}
              style={{ background: "#C48A9F", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer" }}>
              {editSaving ? "Mettre à jour" : "Créer l'objectif"}
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
            <p style={{ color: "rgba(253,251,247,0.3)", fontSize: "13px" }}>Aucun objectif — créez votre premier objectif !</p>
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
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button className="icon-btn edit" onClick={() => handleEdit(s)} title="Modifier">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(s._id)} title="Supprimer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {s.deadline && (
                    <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.3)", marginBottom: "2px" }}>
                      Échéance : {new Date(s.deadline).toLocaleDateString("fr-FR")}
                    </p>
                  )}

                  <div className="progress-bar-bg">
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: "100px", transition: "width 0.6s ease" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: "20px", fontWeight: 300, color: "#FDFBF7" }}>
                      {s.currentAmount.toLocaleString()} FCFA
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: 500, color: s.color, fontFamily: "\"Cormorant Garamond\", serif" }}>{pct}%</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(253,251,247,0.35)", marginBottom: "16px" }}>
                    <span>Objectif : {s.targetAmount.toLocaleString()} FCFA</span>
                    <span>Reste : {remaining.toLocaleString()} FCFA</span>
                  </div>

                  {/* Mise à jour montant */}
                  {updateId === s._id ? (
                    <div>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                        <button className={`mode-btn add ${updateMode === "add" ? "active" : ""}`} onClick={() => setUpdateMode("add")}>+ Ajouter</button>
                        <button className={`mode-btn sub ${updateMode === "subtract" ? "active" : ""}`} onClick={() => setUpdateMode("subtract")}>- Retirer</button>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input type="number" placeholder="Montant" value={updateAmount} onChange={e => setUpdateAmount(e.target.value)} className="vault-input" style={{ flex: 1 }} />
                        <button onClick={() => handleUpdate(s)}
                          style={{ background: updateMode === "add" ? "#069494" : "#C48A9F", border: "none", borderRadius: "6px", color: "#FDFBF7", fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                          Valider
                        </button>
                        <button onClick={() => { setUpdateId(null); setUpdateAmount(""); }}
                          style={{ background: "none", border: "0.5px solid rgba(253,251,247,0.15)", borderRadius: "6px", color: "rgba(253,251,247,0.4)", fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", padding: "8px 12px", cursor: "pointer" }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setUpdateId(s._id); setUpdateAmount(""); setUpdateMode("add"); }}
                      style={{ background: "none", border: `0.5px solid ${s.color}`, borderRadius: "6px", color: s.color, fontFamily: "\"DM Sans\", sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
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