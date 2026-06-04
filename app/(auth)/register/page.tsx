"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue");
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .vault-input { background: rgba(253,251,247,0.04); border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #FDFBF7; outline: none; transition: border-color 0.3s; width: 100%; }
        .vault-input:focus { border-color: #C48A9F; }
        .vault-input::placeholder { color: rgba(253,251,247,0.2); }
        .bg-grid { background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(6,148,148,0.06) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(6,148,148,0.06) 40px); }
      `}</style>

      <div className="min-h-screen bg-[#0A1110] bg-grid flex items-center justify-center p-4 relative overflow-hidden" style={{fontFamily:"'DM Sans', sans-serif"}}>

        <div className="absolute w-96 h-96 rounded-full pointer-events-none" style={{background:"radial-gradient(circle, rgba(196,138,159,0.1) 0%, transparent 70%)", top:"-80px", right:"-80px"}}/>
        <div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{background:"radial-gradient(circle, rgba(6,148,148,0.08) 0%, transparent 70%)", bottom:"-40px", left:"-40px"}}/>

        <div className="w-full max-w-sm relative z-10" style={{border:"0.5px solid rgba(253,251,247,0.08)", borderRadius:"12px", background:"rgba(253,251,247,0.02)", backdropFilter:"blur(8px)", padding:"36px 32px"}}>

          <div className="flex flex-col items-center mb-7">
            <svg width="64" height="64" viewBox="0 0 72 72" fill="none">
              <rect x="6" y="6" width="60" height="60" rx="6" fill="#111f1e" stroke="#C48A9F" strokeWidth="1"/>
              <rect x="10" y="10" width="52" height="52" rx="4" fill="#0d1a18" stroke="#D4AF37" strokeWidth="0.5"/>
              <circle cx="36" cy="36" r="16" fill="#0d1a18" stroke="#D4AF37" strokeWidth="0.8"/>
              <circle cx="36" cy="36" r="10" fill="#0d1a18" stroke="#C48A9F" strokeWidth="0.6"/>
              <line x1="36" y1="28" x2="36" y2="34" stroke="#C48A9F" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="30" y1="36" x2="42" y2="36" stroke="#C48A9F" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="36" cy="36" r="2" fill="#D4AF37"/>
              <rect x="52" y="32" width="5" height="8" rx="1.5" fill="#D4AF37" opacity="0.7"/>
            </svg>
            <p className="mt-3 tracking-[0.18em] uppercase text-[#FDFBF7] text-xl" style={{fontFamily:"'Cormorant Garamond', serif", fontWeight:300}}>MyKalpé</p>
            <p className="mt-1 text-[10px] tracking-[0.22em] uppercase" style={{color:"#C48A9F"}}>Nouveau membre</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1" style={{height:"0.5px", background:"rgba(253,251,247,0.12)"}}/>
            <div style={{width:"6px", height:"6px", background:"#D4AF37", transform:"rotate(45deg)"}}/>
            <div className="flex-1" style={{height:"0.5px", background:"rgba(253,251,247,0.12)"}}/>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm" style={{background:"rgba(196,138,159,0.1)", border:"0.5px solid rgba(196,138,159,0.3)", color:"#C48A9F"}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:"rgba(253,251,247,0.5)"}}>Nom complet</label>
              <input type="text" required placeholder="Marieme Kamara" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="vault-input" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:"rgba(253,251,247,0.5)"}}>Adresse email</label>
              <input type="email" required placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="vault-input" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:"rgba(253,251,247,0.5)"}}>Mot de passe</label>
              <input type="password" required minLength={6} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="vault-input" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-md text-[13px] tracking-[0.1em] uppercase font-medium transition-all disabled:opacity-50" style={{background:"#C48A9F", color:"#FDFBF7", border:"none", cursor:"pointer"}}>
              {loading ? "Création..." : "Créer mon coffre"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-5" style={{color:"rgba(253,251,247,0.35)"}}>
            Déjà membre ?{" "}
            <Link href="/login" style={{color:"#069494", fontWeight:500}}>Se connecter</Link>
          </p>
        </div>
      </div>
    </>
  );
}