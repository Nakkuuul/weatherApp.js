// ── Change this to match your backend URL ──────────────────────────
const BASE_URL = "http://localhost:8080/api/v1";
// ───────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
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
  // NOTE: Your backend uses GET /getWeather with a request body.
  // This is non-standard — GET requests with bodies may be stripped by
  // some proxies/servers. If this fails, change your backend route to
  // POST /getWeather or read cityName from req.query instead.
  getWeather: (cityName, token) =>
    request("/getWeather", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cityName }),
    }),
};
