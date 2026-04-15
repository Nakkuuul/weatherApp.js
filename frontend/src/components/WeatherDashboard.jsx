import { useState } from "react";
import { weatherApi } from "../api";

export default function WeatherDashboard({ token, email, onLogout, showToast }) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(ev) {
    ev.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { ok, data } = await weatherApi.getWeather(city.trim(), token);
      if (!ok) {
        showToast(data.message || "Could not fetch weather data.");
        setWeather(null);
      } else {
        setWeather(data.data);
      }
    } catch {
      showToast("Cannot reach the weather service.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.root}>
      <Background />

      {/* ── Nav ─────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="#22d3ee" strokeWidth="1.5"/>
            <path d="M10 22c2-4 6-7 8-10 2 3 6 6 8 10" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="18" cy="10" r="3" fill="#22d3ee" opacity=".35"/>
          </svg>
          <span style={s.navBrand}>Atmosphera</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navEmail}>{email}</span>
          <button className="btn btn-ghost" style={{ height: 36, padding: "0 16px", fontSize: 12 }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Hero search ─────────────────── */}
      <div style={s.hero}>
        <p className="label" style={{ marginBottom: 12, animation: "fadeUp 0.4s both" }}>
          Real-time weather intelligence
        </p>
        <h1 style={{ ...s.heroTitle, animation: "fadeUp 0.4s 0.05s both" }}>
          Where are you headed?
        </h1>
        <form onSubmit={handleSearch} style={{ ...s.searchBar, animation: "fadeUp 0.4s 0.1s both" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name — e.g. Mumbai, Tokyo, London"
            style={s.searchInput}
          />
          <button type="submit" className="btn btn-primary" style={{ height: 44, flexShrink: 0 }} disabled={loading || !city.trim()}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : "Search"}
          </button>
        </form>
      </div>

      {/* ── Content ─────────────────────── */}
      <div style={s.content}>
        {loading && <LoadingSkeleton />}

        {!loading && !weather && searched && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                <path d="M12 8v4m0 4h.01"/>
              </svg>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>No data found. Try a different city name.</p>
          </div>
        )}

        {!loading && !searched && <EmptyState />}

        {!loading && weather && <WeatherResult data={weather} />}
      </div>
    </div>
  );
}

/* ── Weather Result ───────────────────────────── */
function WeatherResult({ data }) {
  const { dataOf, temperature, wind, pressure, precipitation, humidity, feels_like, heat_index, aqi } = data;

  return (
    <div style={s.results} className="fade-in">
      {/* Location + Temp hero */}
      <div style={s.heroCard} className="glass fade-up">
        <div>
          <h2 style={s.cityName}>{dataOf.city}</h2>
          <p style={s.cityMeta}>{[dataOf.state, dataOf.country].filter(Boolean).join(", ")}</p>
        </div>
        <div style={s.tempBlock}>
          <span style={s.tempBig}>{temperature.temperature_c}°</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Chip label="C" />
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{temperature.temperature_f}°F</span>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={s.statGrid}>
        <StatCard icon={<HumidityIcon />} label="Humidity"     value={`${humidity}%`}                    color="var(--accent)" />
        <StatCard icon={<FeelsIcon />}    label="Feels Like"   value={`${feels_like.feelslike_c}°C`}     color="var(--warm)" />
        <StatCard icon={<HeatIcon />}     label="Heat Index"   value={`${heat_index.heatindex_c}°C`}     color="var(--danger)" />
        <StatCard icon={<RainIcon />}     label="Precipitation" value={`${precipitation.precipitation_mm} mm`} color="#818cf8" />
      </div>

      {/* Wind + Pressure */}
      <div style={s.twoCol}>
        <SectionCard title="Wind" icon={<WindIcon />}>
          <Row label="Speed"     value={`${wind.wind_kph} km/h`} sub={`${wind.wind_mph} mph`} />
          <Row label="Direction" value={`${wind.wind_degree}°`}  sub={degToCompass(wind.wind_degree)} />
          <WindCompass degree={wind.wind_degree} />
        </SectionCard>

        <SectionCard title="Pressure" icon={<PressureIcon />}>
          <Row label="Millibars" value={`${pressure.pressure_mb} mb`} />
          <Row label="Inches"    value={`${pressure.pressure_in} in`} />
          <PressureBar value={pressure.pressure_mb} />
        </SectionCard>
      </div>

      {/* AQI */}
      <SectionCard title="Air Quality Index" icon={<AqiIcon />} fullWidth>
        <div style={s.aqiGrid}>
          {[
            { key: "co",    label: "CO",    unit: "μg/m³", v: aqi.co    },
            { key: "no2",   label: "NO₂",   unit: "μg/m³", v: aqi.no2   },
            { key: "o3",    label: "O₃",    unit: "μg/m³", v: aqi.o3    },
            { key: "so2",   label: "SO₂",   unit: "μg/m³", v: aqi.so2   },
            { key: "pm2_5", label: "PM2.5", unit: "μg/m³", v: aqi.pm2_5 },
            { key: "pm10",  label: "PM10",  unit: "μg/m³", v: aqi.pm10  },
          ].map(({ key, label, unit, v }) => (
            <AqiItem key={key} label={label} unit={unit} value={v} />
          ))}
        </div>
        <AqiLegend />
      </SectionCard>
    </div>
  );
}

/* ── Sub-components ───────────────────────────── */
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...s.statCard }} className="glass fade-up">
      <div style={{ color, opacity: 0.85, marginBottom: 12 }}>{icon}</div>
      <p className="label" style={{ marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-head)", color }}>{value}</p>
    </div>
  );
}

function SectionCard({ title, icon, children, fullWidth }) {
  return (
    <div style={{ ...s.sectionCard, ...(fullWidth ? { gridColumn: "1 / -1" } : {}) }} className="glass fade-up">
      <div style={s.sectionHead}>
        <span style={{ color: "var(--accent)", opacity: 0.8 }}>{icon}</span>
        <h3 style={s.sectionTitle}>{title}</h3>
      </div>
      <hr className="divider" style={{ marginBottom: 20 }} />
      {children}
    </div>
  );
}

function Row({ label, value, sub }) {
  return (
    <div style={s.row}>
      <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>{sub}</span>}
      </div>
    </div>
  );
}

function WindCompass({ degree }) {
  const r = 54;
  const angle = ((degree - 90) * Math.PI) / 180;
  const x2 = r + Math.cos(angle) * 34;
  const y2 = r + Math.sin(angle) * 34;
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke="var(--border)" strokeWidth="1"/>
        {["N","E","S","W"].map((d, i) => {
          const a = (i * 90 - 90) * Math.PI / 180;
          return <text key={d} x={r + Math.cos(a) * (r - 10)} y={r + Math.sin(a) * (r - 10) + 4} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="var(--font-head)">{d}</text>;
        })}
        <line x1={r} y1={r} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx={r} cy={r} r="3" fill="var(--accent)"/>
      </svg>
    </div>
  );
}

function PressureBar({ value }) {
  const min = 950, max = 1050;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const color = pct < 33 ? "var(--danger)" : pct < 66 ? "var(--warning)" : "var(--success)";
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Low (950)</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>High (1050)</span>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

function AqiItem({ label, unit, value }) {
  const v = parseFloat(value) || 0;
  const color = v < 50 ? "var(--success)" : v < 150 ? "var(--warning)" : "var(--danger)";
  const dim   = v < 50 ? "var(--success-dim)" : v < 150 ? "var(--warning-dim)" : "var(--danger-dim)";
  return (
    <div style={{ ...s.aqiItem, background: dim }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-head)", color }}>{v.toFixed(1)}</p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{unit}</p>
    </div>
  );
}

function AqiLegend() {
  return (
    <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
      {[
        { color: "var(--success)", label: "Good  < 50" },
        { color: "var(--warning)", label: "Moderate  50–150" },
        { color: "var(--danger)",  label: "Poor  > 150" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }}/>
          {label}
        </div>
      ))}
    </div>
  );
}

function Chip({ label }) {
  return (
    <span style={{ background: "var(--accent-dim)", color: "var(--accent)", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
      °{label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={s.results}>
      <div className="skeleton" style={{ height: 140, borderRadius: "var(--radius-lg)" }} />
      <div style={s.statGrid}>
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--radius-lg)" }} />)}
      </div>
      <div style={s.twoCol}>
        {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)" }} />)}
      </div>
      <div className="skeleton" style={{ height: 180, borderRadius: "var(--radius-lg)" }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ ...s.empty, animation: "fadeUp 0.5s 0.2s both", opacity: 0 }} className="fade-up">
      <div style={s.globe}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="var(--border-strong)" strokeWidth="1.5"/>
          <ellipse cx="32" cy="32" rx="14" ry="30" stroke="var(--border-strong)" strokeWidth="1.5"/>
          <line x1="2" y1="32" x2="62" y2="32" stroke="var(--border-strong)" strokeWidth="1.5"/>
          <line x1="8" y1="18" x2="56" y2="18" stroke="var(--border-strong)" strokeWidth="1.2"/>
          <line x1="8" y1="46" x2="56" y2="46" stroke="var(--border-strong)" strokeWidth="1.2"/>
          <circle cx="32" cy="32" r="4" fill="var(--accent)" opacity="0.4"/>
        </svg>
      </div>
      <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
        Search any city worldwide
      </p>
      <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 320 }}>
        Get real-time temperature, wind, pressure, precipitation and air quality data instantly.
      </p>
    </div>
  );
}

function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }} aria-hidden>
      {[
        { w: 600, h: 600, top: "-10%", left: "-5%",  color: "rgba(34,211,238,0.06)", dur: "14s", delay: "0s" },
        { w: 400, h: 400, top: "60%",  left: "70%",  color: "rgba(251,146,60,0.05)", dur: "18s", delay: "6s" },
        { w: 300, h: 300, top: "40%",  left: "30%",  color: "rgba(34,211,238,0.04)", dur: "11s", delay: "3s" },
      ].map((o, i) => (
        <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, borderRadius: "50%", background: o.color, filter: "blur(80px)", animation: `orb ${o.dur} ease-in-out ${o.delay} infinite` }} />
      ))}
    </div>
  );
}

/* ── Helpers ──────────────────────────────────── */
function degToCompass(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/* ── SVG Icons ────────────────────────────────── */
const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const HumidityIcon = () => <svg {...iconProps}><path d="M12 2C6.5 9 4 13.5 4 16a8 8 0 0 0 16 0c0-2.5-2.5-7-8-14z"/></svg>;
const FeelsIcon    = () => <svg {...iconProps}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>;
const HeatIcon     = () => <svg {...iconProps}><path d="M12 2v10m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M9 2h6"/></svg>;
const RainIcon     = () => <svg {...iconProps}><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 15.1"/><path d="M8 19v2m4-2v2m4-2v2"/></svg>;
const WindIcon     = () => <svg {...iconProps}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>;
const PressureIcon = () => <svg {...iconProps}><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 0 2 2"/></svg>;
const AqiIcon      = () => <svg {...iconProps}><path d="M2 12h2m16 0h2M12 2v2m0 16v2m-7.07-2.93 1.41-1.41M17.66 6.34l1.41-1.41M4.93 6.34 6.34 7.75M17.66 17.66l1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>;

/* ── Styles ───────────────────────────────────── */
const s = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 68,
    borderBottom: "1px solid var(--border)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: "rgba(7,11,18,0.7)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  navBrand: { fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navEmail: { fontSize: 13, color: "var(--text-secondary)" },

  hero: {
    textAlign: "center",
    padding: "60px 24px 40px",
  },
  heroTitle: {
    fontFamily: "var(--font-head)",
    fontSize: 42,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: 28,
    lineHeight: 1.1,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    maxWidth: 600,
    margin: "0 auto",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--radius-xl)",
    padding: "8px 8px 8px 20px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    outline: "none",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: 15,
  },

  content: {
    flex: 1,
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    padding: "0 24px 64px",
  },

  results: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  heroCard: {
    padding: "32px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  cityName: {
    fontFamily: "var(--font-head)",
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: 6,
  },
  cityMeta: {
    fontSize: 15,
    color: "var(--text-secondary)",
  },
  tempBlock: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  },
  tempBig: {
    fontFamily: "var(--font-head)",
    fontSize: 80,
    fontWeight: 800,
    lineHeight: 1,
    color: "var(--warm)",
  },

  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  statCard: {
    padding: "24px 20px",
    borderRadius: "var(--radius-lg)",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  sectionCard: {
    padding: "28px 32px",
    borderRadius: "var(--radius-lg)",
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "var(--font-head)",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
  },

  aqiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 12,
  },
  aqiItem: {
    padding: "16px 12px",
    borderRadius: "var(--radius-md)",
    textAlign: "center",
  },

  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: "80px 24px",
  },
  emptyIcon: {
    marginBottom: 8,
  },
  globe: {
    marginBottom: 12,
    opacity: 0.5,
  },
};
