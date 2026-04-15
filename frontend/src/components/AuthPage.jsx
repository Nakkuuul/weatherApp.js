import { useState } from "react";
import { authApi } from "../api";

export default function AuthPage({ onAuthSuccess, showToast }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.trim())             e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)                 e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    if (mode === "register" && password !== confirm)
      e.confirm = "Passwords don't match";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      if (mode === "register") {
        const { ok, data } = await authApi.register(email, password);
        if (!ok) { showToast(data.message || "Registration failed"); return; }
        showToast("Account created! Please log in.", "success");
        setMode("login");
        setPassword("");
        setConfirm("");
      } else {
        const { ok, data } = await authApi.login(email, password);
        if (!ok) { showToast(data.message || "Login failed"); return; }
        onAuthSuccess({ token: data.token, email: data.user.email });
      }
    } catch {
      showToast("Cannot connect to server. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
    setPassword("");
    setConfirm("");
  }

  return (
    <div style={styles.root}>
      {/* ── Left panel ───────────────────── */}
      <div style={styles.left}>
        <Orbs />
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="#22d3ee" strokeWidth="1.5" />
              <path d="M10 22c2-4 6-7 8-10 2 3 6 6 8 10" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <circle cx="18" cy="10" r="3" fill="#22d3ee" opacity=".35"/>
            </svg>
            <span style={styles.logoText}>Atmosphera</span>
          </div>
          <h1 style={styles.heroHead}>Read the sky,<br />before it reads you.</h1>
          <p style={styles.heroSub}>
            Hyper-local weather intelligence — temperature, wind,
            pressure, precipitation and full air-quality index at your fingertips.
          </p>
          <div style={styles.featureList}>
            {["Real-time conditions", "Air quality index", "JWT-secured API", "Global city coverage"].map((f) => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel / Form ────────────── */}
      <div style={styles.right}>
        <div style={styles.formCard} className="fade-up">
          {/* Tabs */}
          <div style={styles.tabs}>
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrors({}); setPassword(""); setConfirm(""); }}
                style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={styles.formTitle}>
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p style={styles.formSub}>
              {mode === "login"
                ? "Enter your credentials to access the dashboard."
                : "Create a free account to start tracking weather."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
              error={errors.email}
            />
            <Field
              label="Password"
              type="password"
              placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
              value={password}
              onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
              error={errors.password}
            />
            {mode === "register" && (
              <Field
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: "" })); }}
                error={errors.confirm}
              />
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={styles.switchText}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} style={styles.switchLink}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ ...styles.fieldLabel, display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input${error ? " error" : ""}`}
        autoComplete={type === "password" ? "current-password" : "email"}
      />
      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

function Orbs() {
  return (
    <div style={styles.orbContainer} aria-hidden>
      {[
        { w: 480, h: 480, top: "5%",  left: "10%",  color: "rgba(34,211,238,0.12)",  delay: "0s",   dur: "12s" },
        { w: 340, h: 340, top: "55%", left: "45%",  color: "rgba(251,146,60,0.08)",  delay: "4s",   dur: "15s" },
        { w: 260, h: 260, top: "25%", left: "55%",  color: "rgba(34,211,238,0.07)",  delay: "8s",   dur: "10s" },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.w,
            height: o.h,
            top: o.top,
            left: o.left,
            borderRadius: "50%",
            background: o.color,
            filter: "blur(60px)",
            animation: `orb ${o.dur} ease-in-out ${o.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  left: {
    flex: "0 0 52%",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #070b12 0%, #0c1424 100%)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    padding: "60px 64px",
  },
  leftInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 440,
  },
  orbContainer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 48,
  },
  logoText: {
    fontFamily: "var(--font-head)",
    fontSize: 22,
    fontWeight: 700,
    color: "#e2eaf5",
    letterSpacing: "-0.01em",
  },
  heroHead: {
    fontFamily: "var(--font-head)",
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#e2eaf5",
    marginBottom: 20,
    letterSpacing: "-0.03em",
  },
  heroSub: {
    fontSize: 16,
    lineHeight: 1.7,
    color: "var(--text-secondary)",
    marginBottom: 36,
    maxWidth: 380,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--accent)",
    flexShrink: 0,
  },

  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    background: "var(--bg-base)",
  },
  formCard: {
    width: "100%",
    maxWidth: 420,
  },
  tabs: {
    display: "flex",
    gap: 4,
    background: "rgba(255,255,255,0.04)",
    padding: 4,
    borderRadius: "var(--radius-md)",
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    background: "transparent",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontFamily: "var(--font-head)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-secondary)",
    letterSpacing: "0.03em",
    transition: "all 0.2s",
    textTransform: "uppercase",
  },
  tabActive: {
    background: "rgba(255,255,255,0.08)",
    color: "var(--accent)",
  },
  formTitle: {
    fontFamily: "var(--font-head)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 6,
    letterSpacing: "-0.02em",
  },
  formSub: {
    fontSize: 14,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
  },
  errorMsg: {
    marginTop: 6,
    fontSize: 12,
    color: "var(--danger)",
  },
  switchText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    padding: 0,
  },
};
