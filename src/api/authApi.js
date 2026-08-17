import { axiosClient } from "./axiosClient.js";

export async function registerRequest(payload) {
  const { data } = await axiosClient.post("/api/auth/register", payload);
  return data;
}

export async function loginRequest({ email, password }) {
  const { data } = await axiosClient.post("/api/auth/login", { email, password });
  return data;
}

export async function refreshRequest(refreshToken) {
  const { data } = await axiosClient.post("/api/auth/refresh", { refreshToken });
  return data;
}

export async function logoutRequest(refreshToken) {
  await axiosClient.post("/api/auth/logout", { refreshToken });
}

export async function meRequest() {
  const { data } = await axiosClient.get("/api/auth/me");
  return data;
}
