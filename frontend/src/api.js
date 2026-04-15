// ── Change this to match your backend URL ──────────────────────────
const BASE_URL = "http://localhost:8080/api/v1";
// ───────────────────────────────────────────────────────────────────

async function request(path, { headers: extraHeaders = {}, ...options } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    ...options,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export const authApi = {
  register: (email, password) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const weatherApi = {
  getWeather: (cityName, token) =>
    request("/getWeather", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cityName }),
    }),
};