"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap");
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .landing { background: #0A1110; min-height: 100vh; font-family: "DM Sans", sans-serif; color: #FDFBF7; overflow-x: hidden; }
        
        .bg-grid { background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(6,148,148,0.05) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(6,148,148,0.05) 40px); }
        
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 60px; border-bottom: 0.5px solid rgba(253,251,247,0.06); position: sticky; top: 0; background: rgba(10,17,16,0.95); backdrop-filter: blur(12px); z-index: 100; }
        
        .nav-logo { font-family: "Cormorant Garamond", serif; font-size: 22px; font-weight: 300; letter-spacing: 0.18em; color: #FDFBF7; text-transform: uppercase; }
        
        .nav-btns { display: flex; gap: 12px; }
        
        .btn-outline { background: none; border: 0.5px solid rgba(253,251,247,0.2); border-radius: 6px; color: rgba(253,251,247,0.7); font-family: "DM Sans", sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 20px; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: #069494; color: #069494; }
        
        .btn-filled { background: #069494; border: none; border-radius: 6px; color: #FDFBF7; font-family: "DM Sans", sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 20px; cursor: pointer; transition: all 0.2s; }
        .btn-filled:hover { background: #057a7a; }

        .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 24px 80px; position: relative; }
        
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(6,148,148,0.1); border: 0.5px solid rgba(6,148,148,0.3); border-radius: 100px; padding: 6px 16px; margin-bottom: 32px; }
        .hero-badge-dot { width: 6px; height: 6px; background: #069494; border-radius: 50%; }
        .hero-badge-text { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #069494; }
        
        .hero-title { font-family: "Cormorant Garamond", serif; font-size: 64px; font-weight: 300; line-height: 1.1; letter-spacing: 0.04em; color: #FDFBF7; max-width: 700px; margin-bottom: 24px; }
        .hero-title span { color: #D4AF37; }
        
        .hero-sub { font-size: 16px; color: rgba(253,251,247,0.5); line-height: 1.7; max-width: 480px; margin-bottom: 40px; font-weight: 300; }
        
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        
        .btn-gold { background: #D4AF37; border: none; border-radius: 6px; color: #0A1110; font-family: "DM Sans", sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 32px; cursor: pointer; transition: all 0.2s; }
        .btn-gold:hover { background: #c49d2e; transform: translateY(-1px); }

        .btn-rose { background: #C48A9F; border: none; border-radius: 6px; color: #0A1110; font-family: "DM Sans", sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 32px; cursor: pointer; transition: all 0.2s; }
        .btn-rose:hover { background: #b1798e; transform: translateY(-1px); }
        
        .btn-ghost { background: none; border: 0.5px solid rgba(253,251,247,0.15); border-radius: 6px; color: rgba(253,251,247,0.6); font-family: "DM Sans", sans-serif; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 32px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: rgba(253,251,247,0.4); color: #FDFBF7; }

        .divider-gold { display: flex; align-items: center; gap: 16px; margin: 0 auto 80px; max-width: 300px; }
        .divider-line { flex: 1; height: 0.5px; background: rgba(253,251,247,0.1); }
        .divider-diamond { width: 6px; height: 6px; background: #D4AF37; transform: rotate(45deg); flex-shrink: 0; }

        .features { padding: 0 60px 100px; max-width: 1100px; margin: 0 auto; }
        .features-label { text-align: center; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #069494; margin-bottom: 16px; }
        .features-title { text-align: center; font-family: "Cormorant Garamond", serif; font-size: 40px; font-weight: 300; color: #FDFBF7; letter-spacing: 0.06em; margin-bottom: 60px; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        
        .feature-card { background: rgba(253,251,247,0.02); border: 0.5px solid rgba(253,251,247,0.08); border-radius: 12px; padding: 28px; transition: all 0.3s; cursor: default; }
        .feature-card:hover { background: rgba(253,251,247,0.04); border-color: rgba(6,148,148,0.3); transform: translateY(-2px); }
        
        .feature-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 20px; }
        .feature-icon svg { width: 21px; height: 21px; color: #FDFBF7; display: block; }
        .feature-icon-teal { background: rgba(6,148,148,0.12); border: 0.5px solid rgba(6,148,148,0.2); }
        .feature-icon-rose { background: rgba(196,138,159,0.12); border: 0.5px solid rgba(196,138,159,0.2); }
        .feature-icon-gold { background: rgba(212,175,55,0.12); border: 0.5px solid rgba(212,175,55,0.2); }
        
        .feature-title { font-size: 15px; font-weight: 500; color: #FDFBF7; letter-spacing: 0.04em; margin-bottom: 10px; }
        .feature-desc { font-size: 13px; color: rgba(253,251,247,0.45); line-height: 1.7; font-weight: 300; }

        .steps { padding: 0 60px 100px; max-width: 1100px; margin: 0 auto; }
        .steps-label { text-align: center; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #C48A9F; margin-bottom: 16px; }
        .steps-title { text-align: center; font-family: "Cormorant Garamond", serif; font-size: 40px; font-weight: 300; color: #FDFBF7; letter-spacing: 0.06em; margin-bottom: 60px; }
        
        .steps-list { display: flex; flex-direction: column; gap: 0; max-width: 600px; margin: 0 auto; }
        
        .step { display: flex; gap: 24px; padding: 28px 0; border-bottom: 0.5px solid rgba(253,251,247,0.06); }
        .step:last-child { border-bottom: none; }
        
        .step-number { font-family: "Cormorant Garamond", serif; font-size: 40px; font-weight: 300; color: rgba(212,175,55,0.3); line-height: 1; flex-shrink: 0; width: 48px; }
        .step-content { padding-top: 4px; }
        .step-title { font-size: 15px; font-weight: 500; color: #FDFBF7; margin-bottom: 8px; letter-spacing: 0.04em; }
        .step-desc { font-size: 13px; color: rgba(253,251,247,0.45); line-height: 1.7; font-weight: 300; }

        .cta { padding: 80px 60px; text-align: center; border-top: 0.5px solid rgba(253,251,247,0.06); position: relative; }
        .cta-title { font-family: "Cormorant Garamond", serif; font-size: 48px; font-weight: 300; color: #FDFBF7; letter-spacing: 0.06em; margin-bottom: 16px; }
        .cta-sub { font-size: 14px; color: rgba(253,251,247,0.4); margin-bottom: 40px; font-weight: 300; }
        
        .footer { padding: 24px 60px; border-top: 0.5px solid rgba(253,251,247,0.06); display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: "Cormorant Garamond", serif; font-size: 16px; font-weight: 300; letter-spacing: 0.18em; color: rgba(253,251,247,0.3); text-transform: uppercase; }
        .footer-text { font-size: 11px; color: rgba(253,251,247,0.2); letter-spacing: 0.08em; }

        .glow-teal { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(6,148,148,0.08) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; border-radius: 50%; }
        .glow-rose { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(196,138,159,0.06) 0%, transparent 70%); bottom: -50px; left: -50px; pointer-events: none; border-radius: 50%; }
      `}</style>

      <div className="landing bg-grid">

        {/* Navbar */}
        <nav className="nav">
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
              <rect x="6" y="6" width="60" height="60" rx="6" fill="#111f1e" stroke="#069494" strokeWidth="1.5"/>
              <circle cx="36" cy="36" r="16" fill="#0d1a18" stroke="#D4AF37" strokeWidth="1"/>
              <circle cx="36" cy="36" r="8" fill="#0d1a18" stroke="#069494" strokeWidth="0.8"/>
              <line x1="36" y1="29" x2="36" y2="33" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="36" cy="36" r="2" fill="#D4AF37"/>
              <rect x="52" y="32" width="4" height="8" rx="1" fill="#D4AF37" opacity="0.7"/>
            </svg>
            <span className="nav-logo">MyKalpé</span>
          </div>
          <div className="nav-btns">
            <button className="btn-outline" onClick={() => router.push("/login")}>Se connecter</button>
            <button className="btn-filled" onClick={() => router.push("/register")}>Commencer</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero" style={{position:"relative"}}>
          <div className="glow-teal"/>
          <div className="glow-rose"/>

          <div className="hero-badge">
            <div className="hero-badge-dot"/>
            <span className="hero-badge-text">Coffre-Fort Numérique</span>
          </div>

          <h1 className="hero-title">
            Gérez vos finances<br/>avec <span>élégance</span>
          </h1>

          <p className="hero-sub">
            MyKalpé est votre espace personnel sécurisé pour suivre vos dépenses, 
            planifier votre épargne et visualiser votre santé financière en temps réel.
          </p>

          <div className="hero-btns">
            <button className="btn-gold" onClick={() => router.push("/register")}>
              Ouvrir mon coffre
            </button>
            <button className="btn-ghost" onClick={() => router.push("/login")}>
              J&apos;ai déjà un compte
            </button>
          </div>
        </section>

        <div className="divider-gold">
          <div className="divider-line"/>
          <div className="divider-diamond"/>
          <div className="divider-line"/>
        </div>

        {/* Features */}
        <section className="features">
          <p className="features-label">Fonctionnalités</p>
          <h2 className="features-title">Tout ce dont vous avez besoin</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19h16" />
                  <path d="M7 15v-4" />
                  <path d="M12 15V7" />
                  <path d="M17 15v-2" />
                </svg>
              </div>
              <p className="feature-title">Dashboard intelligent</p>
              <p className="feature-desc">Visualisez vos revenus, dépenses et épargnes en un coup d&apos;œil grâce à des graphiques clairs et interactifs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-rose">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7h16a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" />
                  <path d="M16 12h4" />
                </svg>
              </div>
              <p className="feature-title">Suivi des transactions</p>
              <p className="feature-desc">Enregistrez et catégorisez chaque dépense ou revenu. Filtrez par mois, catégorie ou type pour une vue précise.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3" />
                  <path d="M12 19v3" />
                  <path d="M2 12h3" />
                  <path d="M19 12h3" />
                </svg>
              </div>
              <p className="feature-title">Objectifs d&apos;épargne</p>
              <p className="feature-desc">Définissez vos objectifs financiers — voyage, projet, fonds d&apos;urgence — et suivez votre progression visuellement.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3 5 6v6c0 4.2 2.7 7.8 7 9 4.3-1.2 7-4.8 7-9V6l-7-3Z" />
                  <path d="m9.5 12 1.8 1.8 3.7-4" />
                </svg>
              </div>
              <p className="feature-title">Données sécurisées</p>
              <p className="feature-desc">Vos données financières sont chiffrées et stockées de manière sécurisée. Votre coffre, vos règles.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-rose">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M8 3v4" />
                  <path d="M16 3v4" />
                  <path d="M4 10h16" />
                </svg>
              </div>
              <p className="feature-title">Historique mensuel</p>
              <p className="feature-desc">Consultez l&apos;historique complet de vos finances mois par mois et identifiez vos habitudes de dépenses.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 18h16" />
                  <path d="M7 14l3-4 3 2 4-6" />
                  <path d="M17 6h2v2" />
                </svg>
              </div>
              <p className="feature-title">Rapports visuels</p>
              <p className="feature-desc">Des graphiques élégants pour comprendre où va votre argent et prendre de meilleures décisions financières.</p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="steps">
          <p className="steps-label">Comment ça marche</p>
          <h2 className="steps-title">Simple comme bonjour</h2>

          <div className="steps-list">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <p className="step-title">Créez votre coffre</p>
                <p className="step-desc">Inscrivez-vous en quelques secondes. Votre espace personnel est créé instantanément et sécurisé avec un mot de passe chiffré.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <p className="step-title">Ajoutez vos transactions</p>
                <p className="step-desc">Enregistrez vos revenus et dépenses du mois. Catégorisez-les pour avoir une vue claire de vos habitudes financières.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <p className="step-title">Définissez vos objectifs</p>
                <p className="step-desc">Créez des objectifs d&apos;épargne avec un montant cible et une date limite. Suivez votre progression en temps réel.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <p className="step-title">Analysez et progressez</p>
                <p className="step-desc">Consultez votre dashboard pour comprendre vos finances et prendre de meilleures décisions chaque mois.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta" style={{position:"relative"}}>
          <div className="glow-teal" style={{top:"auto", bottom:"-100px", right:"-100px"}}/>
          <h2 className="cta-title">Prêt à ouvrir votre coffre ?</h2>
          <p className="cta-sub">Rejoignez MyKalpé et prenez le contrôle de vos finances dès aujourd&apos;hui.</p>
          <button className="btn-rose" onClick={() => router.push("/register")}>
            Créer mon compte gratuitement
          </button>
        </section>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-logo">MyKalpé</span>
          <span className="footer-text">© 2025 MyKalpé - Coffre-Fort Numérique - Marième KAMARA </span>
        </footer>

      </div>
    </>
  );
}