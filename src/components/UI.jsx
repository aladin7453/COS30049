//  Shared UI Components 
export function LoadingRows({ cols = 4, rows = 4 }) {
  const t = window.__T;
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <div style={{ height: 14, borderRadius: 6, background: t.border, animation: "shimmer 1.5s infinite", width: j === 0 ? "70%" : "50%" }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function LoadingCard() {
  const t = window.__T;
  return (
    <div style={{ padding: 20 }}>
      {[80, 60, 40, 70, 50].map((w, i) => (
        <div key={i} style={{ height: 12, borderRadius: 6, background: t.border, marginBottom: 10, width: `${w}%`, animation: "shimmer 1.5s infinite" }} />
      ))}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  const t = window.__T;
  return (
    <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.red }}>Failed to load data</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{message}</div>
      </div>
      {onRetry && <button className="btn btn-outline btn-sm" onClick={onRetry}>↻ Retry</button>}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, accent }) {
  const t = window.__T;
  return (
    <div className="stat-card" style={{ "--accent": accent || t.greenLight }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function BarChart({ data }) {
  const t = window.__T;
  const max = Math.max(...data.map((d) => d.val));
  return (
    <div className="chart-bars">
      {data.map((d, i) => (
        <div className="chart-bar-wrap" key={i}>
          <div className="chart-bar" style={{ height: `${(d.val / max) * 90}px` }} />
          <div className="chart-bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, color }) {
  const t = window.__T;
  const max = Math.max(...data.map((d) => d.val));
  const W = 300, H = 80, pad = 10;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - (d.val / max) * (H - pad * 2);
    return `${x},${y}`;
  });
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80 }}>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color || t.green} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color || t.green} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${pad},${H} ${pts.join(" ")} ${W - pad},${H}`} fill="url(#lg)" />
        <polyline points={pts.join(" ")} fill="none" stroke={color || t.green} strokeWidth="2" strokeLinejoin="round" />
        {data.map((d, i) => {
          const [x, y] = pts[i].split(",");
          return <circle key={i} cx={x} cy={y} r="3" fill={color || t.green} />;
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 9, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ data }) {
  const t = window.__T;
  const total = data.reduce((s, d) => s + d.val, 0);
  let offset = 0;
  const r = 40, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  return (
    <div className="donut-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.border} strokeWidth="14" />
        {data.map((d, i) => {
          const dash = (d.val / total) * circ;
          const seg = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="14"
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }} />
          );
          offset += dash;
          return seg;
        })}
        <text x="50" y="47" textAnchor="middle" fill={t.text} fontSize="14" fontWeight="800" fontFamily="Syne">{total}</text>
        <text x="50" y="59" textAnchor="middle" fill={t.textMuted} fontSize="8" fontFamily="Space Mono">TOTAL</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div className="legend-item" key={i}>
            <div className="legend-dot" style={{ background: d.color }} />
            <span style={{ color: t.textMuted, flex: 1 }}>{d.label}</span>
            <span style={{ fontWeight: 700, color: t.text }}>{d.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ on, onChange }) {
  return (
    <div className={`toggle ${on ? "on" : "off"}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  );
}
