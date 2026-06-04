"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      setVaultOpen(true);
      setTimeout(() => router.push("/dashboard"), 3200);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .vault-input { background: rgba(253,251,247,0.04); border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #FDFBF7; outline: none; transition: border-color 0.3s; width: 100%; }
        .vault-input:focus { border-color: #069494; }
        .vault-input::placeholder { color: rgba(253,251,247,0.2); }
        @keyframes vaultOpen { 0% { transform: perspective(300px) rotateY(0deg); } 40% { transform: perspective(300px) rotateY(-15deg); } 100% { transform: perspective(300px) rotateY(-75deg); } }
        @keyframes dialSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes lightsOn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .door-group { transform-origin: 60px 60px; animation: vaultOpen 1.2s 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        .dial-anim { transform-origin: 60px 60px; animation: dialSpin 1s 0s ease-in-out forwards; }
        .light-rays { opacity: 0; animation: lightsOn 0.5s 1s ease-out forwards; }
        .vault-text { opacity: 0; animation: fadeUp 0.6s 1.2s forwards; }
        .vault-sub { opacity: 0; animation: fadeUp 0.6s 1.5s forwards; }
        .bg-grid { background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(6,148,148,0.06) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(6,148,148,0.06) 40px); }
      `}</style>

      <div className="min-h-screen bg-[#0A1110] bg-grid flex items-center justify-center p-4 relative overflow-hidden" style={{fontFamily:"'DM Sans', sans-serif"}}>

        {/* Glow effects */}
        <div className="absolute w-96 h-96 rounded-full pointer-events-none" style={{background:"radial-gradient(circle, rgba(6,148,148,0.12) 0%, transparent 70%)", top:"-80px", left:"-80px"}}/>
        <div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{background:"radial-gradient(circle, rgba(196,138,159,0.08) 0%, transparent 70%)", bottom:"-40px", right:"-40px"}}/>

        {/* Vault open overlay */}
        {vaultOpen && (
          <div className="absolute inset-0 bg-[#0A1110] z-50 flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="10" y="10" width="100" height="100" rx="8" fill="#111f1e" stroke="#069494" strokeWidth="1"/>
              <line x1="10" y1="60" x2="110" y2="60" stroke="#069494" strokeWidth="0.5" opacity="0.3"/>
              <g className="light-rays">
                <line x1="60" y1="10" x2="60" y2="0" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/>
                <line x1="85" y1="18" x2="92" y2="10" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/>
                <line x1="35" y1="18" x2="28" y2="10" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/>
                <line x1="110" y1="60" x2="120" y2="60" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/>
                <line x1="10" y1="60" x2="0" y2="60" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"/>
              </g>
              <g className="door-group">
                <rect x="14" y="14" width="92" height="92" rx="6" fill="#132220" stroke="#069494" strokeWidth="1.5"/>
                <circle cx="60" cy="60" r="28" fill="#0d1c1a" stroke="#D4AF37" strokeWidth="1"/>
                <g className="dial-anim">
                  <circle cx="60" cy="60" r="20" fill="#0d1c1a" stroke="#069494" strokeWidth="0.8"/>
                  <line x1="60" y1="42" x2="60" y2="50" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="60" y1="70" x2="60" y2="78" stroke="#069494" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                  <line x1="42" y1="60" x2="50" y2="60" stroke="#069494" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                  <line x1="70" y1="60" x2="78" y2="60" stroke="#069494" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                  <circle cx="60" cy="60" r="3" fill="#D4AF37"/>
                </g>
                <rect x="84" y="54" width="8" height="12" rx="2" fill="#D4AF37" opacity="0.7"/>
                <circle cx="20" cy="30" r="3" fill="#069494" opacity="0.6"/>
                <circle cx="20" cy="90" r="3" fill="#069494" opacity="0.6"/>
              </g>
            </svg>
            <p className="vault-text mt-5 text-[#D4AF37] tracking-[0.2em] uppercase text-lg" style={{fontFamily:"'Cormorant Garamond', serif", fontWeight:300}}>Accès accordé</p>
            <p className="vault-sub mt-2 text-[11px] tracking-[0.2em] uppercase" style={{color:"rgba(253,251,247,0.4)"}}>Bienvenue dans votre coffre numérique</p>
          </div>
        )}

        {/* Card */}
        <div className="w-full max-w-sm relative z-10" style={{border:"0.5px solid rgba(253,251,247,0.08)", borderRadius:"12px", background:"rgba(253,251,247,0.02)", backdropFilter:"blur(8px)", padding:"36px 32px"}}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <svg width="64" height="64" viewBox="0 0 72 72" fill="none">
              <rect x="6" y="6" width="60" height="60" rx="6" fill="#111f1e" stroke="#069494" strokeWidth="1"/>
              <rect x="10" y="10" width="52" height="52" rx="4" fill="#0d1a18" stroke="#D4AF37" strokeWidth="0.5"/>
              <circle cx="36" cy="36" r="16" fill="#0d1a18" stroke="#D4AF37" strokeWidth="0.8"/>
              <circle cx="36" cy="36" r="10" fill="#0d1a18" stroke="#069494" strokeWidth="0.6"/>
              <line x1="36" y1="27" x2="36" y2="32" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="36" cy="36" r="2" fill="#D4AF37"/>
              <rect x="52" y="32" width="5" height="8" rx="1.5" fill="#D4AF37" opacity="0.7"/>
              <circle cx="12" cy="18" r="2" fill="#069494" opacity="0.5"/>
              <circle cx="12" cy="54" r="2" fill="#069494" opacity="0.5"/>
            </svg>
            <p className="mt-3 tracking-[0.18em] uppercase text-[#FDFBF7] text-xl" style={{fontFamily:"'Cormorant Garamond', serif", fontWeight:300}}>MyKalpé</p>
            <p className="mt-1 text-[10px] tracking-[0.22em] uppercase" style={{color:"#069494"}}>Coffre-Fort Numérique</p>
          </div>

          {/* Divider */}
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
              <label className="block text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:"rgba(253,251,247,0.5)"}}>Adresse email</label>
              <input type="email" required placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="vault-input" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase mb-2" style={{color:"rgba(253,251,247,0.5)"}}>Mot de passe</label>
              <input type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="vault-input" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-md text-[13px] tracking-[0.1em] uppercase font-medium transition-all disabled:opacity-50" style={{background:"#069494", color:"#FDFBF7", border:"none", cursor:"pointer"}}>
              {loading ? "Vérification..." : "Ouvrir le coffre"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-5" style={{color:"rgba(253,251,247,0.35)"}}>
            Pas encore membre ?{" "}
            <Link href="/register" style={{color:"#C48A9F", fontWeight:500}}>S&apos;inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </>
  );
}