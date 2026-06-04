"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap");
        .nav-link { color: rgba(253,251,247,0.45); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #069494; }
        .nav-link.active { color: #069494; }
        .signout-btn { background: none; border: 0.5px solid rgba(196,138,159,0.3); border-radius: 4px; color: rgba(196,138,159,0.7); font-family: "DM Sans", sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 14px; cursor: pointer; transition: all 0.2s; }
        .signout-btn:hover { border-color: #C48A9F; color: #C48A9F; }
      `}</style>

      <nav style={{ borderBottom: "0.5px solid rgba(253,251,247,0.08)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>

          {/* Logo */}
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
              <rect x="6" y="6" width="60" height="60" rx="6" fill="#111f1e" stroke="#069494" strokeWidth="1.5"/>
              <circle cx="36" cy="36" r="16" fill="#0d1a18" stroke="#D4AF37" strokeWidth="1"/>
              <circle cx="36" cy="36" r="8" fill="#0d1a18" stroke="#069494" strokeWidth="0.8"/>
              <line x1="36" y1="29" x2="36" y2="33" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="36" cy="36" r="2" fill="#D4AF37"/>
              <rect x="52" y="32" width="4" height="8" rx="1" fill="#D4AF37" opacity="0.7"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 300, letterSpacing: "0.14em", color: "#FDFBF7" }}>
              MyKalpé
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/transactions" className="nav-link">Transactions</Link>
            <Link href="/savings" className="nav-link">Épargne</Link>
          </div>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "12px", color: "rgba(253,251,247,0.35)", letterSpacing: "0.08em" }}>
              {session?.user?.name}
            </span>
            <button className="signout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}