import { axiosClient } from "./axiosClient.js";

export async function listAlertasPaciente(pacienteId) {
  const { data } = await axiosClient.get(`/api/pacientes/${pacienteId}/alertas`);
  return data;
}

export async function createAlertaPaciente(pacienteId, payload) {
  const { data } = await axiosClient.post(`/api/pacientes/${pacienteId}/alertas`, payload);
  return data;
}

export async function updateAlerta(id, payload) {
  const { data } = await axiosClient.patch(`/api/alertas/${id}`, payload);
  return data;
}

export async function deleteAlerta(id) {
  await axiosClient.delete(`/api/alertas/${id}`);
}
