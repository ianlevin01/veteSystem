import { axiosClient } from "./axiosClient.js";

export async function listRecordatoriosPaciente(pacienteId) {
  const { data } = await axiosClient.get(`/api/pacientes/${pacienteId}/recordatorios`);
  return data;
}

export async function listRecordatorios(estado) {
  const { data } = await axiosClient.get("/api/recordatorios", { params: estado ? { estado } : {} });
  return data;
}

export async function deleteRecordatorio(id) {
  await axiosClient.delete(`/api/recordatorios/${id}`);
}
