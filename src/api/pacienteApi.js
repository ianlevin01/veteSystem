import { axiosClient } from "./axiosClient.js";

export async function searchPacientes(query) {
  const { data } = await axiosClient.get("/api/pacientes", { params: { query } });
  return data;
}

export async function getPaciente(id) {
  const { data } = await axiosClient.get(`/api/pacientes/${id}`);
  return data;
}

export async function createPaciente(payload) {
  const { data } = await axiosClient.post("/api/pacientes", payload);
  return data;
}

export async function updatePaciente(id, payload) {
  const { data } = await axiosClient.patch(`/api/pacientes/${id}`, payload);
  return data;
}
