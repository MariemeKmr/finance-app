interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export default function StatCard({ label, value, sub, color = "#069494" }: StatCardProps) {
  return (
    <div style={{
      background: "rgba(253,251,247,0.03)",
      border: "0.5px solid rgba(253,251,247,0.08)",
      borderRadius: "10px",
      padding: "20px 24px",
      borderTop: `2px solid ${color}`,
    }}>
      <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{ fontSize: "26px", fontFamily: "var(--font-display)", fontWeight: 300, color: "#FDFBF7", letterSpacing: "0.04em" }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "11px", color: "rgba(253,251,247,0.3)", marginTop: "6px" }}>
          {sub}
        </p>
      )}
    </div>
  );
}