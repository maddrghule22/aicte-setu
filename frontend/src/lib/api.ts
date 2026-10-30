import axios from "axios";

const BASE = (import.meta as any).env?.VITE_API_URL || "/api";
export const api = axios.create({ baseURL: BASE, timeout: 30000 });

api.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem("token");
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export async function downloadFile(path: string, filename: string) {
  const r = await api.get(path, { responseType: "blob" });
  const url = URL.createObjectURL(r.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function setToken(t: string | null) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

export async function loginApi(email: string, password: string) {
  const r = await api.post("/auth/login", { email, password });
  return r.data;
}
export async function verifyOtp(session_id: string, otp: string) {
  const r = await api.post("/auth/verify-otp", { session_id, otp });
  return r.data;
}