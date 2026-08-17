import { axiosClient } from "./axiosClient.js";

export async function listHistorias(pacienteId) {
  const { data } = await axiosClient.get(`/api/pacientes/${pacienteId}/historias`);
  return data;
}

export async function getHistoria(pacienteId, historiaId) {
  const { data } = await axiosClient.get(`/api/pacientes/${pacienteId}/historias/${historiaId}`);
  return data;
}

export async function createHistoria(pacienteId, payload) {
  const { data } = await axiosClient.post(`/api/pacientes/${pacienteId}/historias`, payload);
  return data;
}

export async function updateHistoria(pacienteId, historiaId, payload) {
  const { data } = await axiosClient.patch(`/api/pacientes/${pacienteId}/historias/${historiaId}`, payload);
  return data;
}

export async function deleteHistoria(pacienteId, historiaId) {
  await axiosClient.delete(`/api/pacientes/${pacienteId}/historias/${historiaId}`);
}
