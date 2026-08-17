import { axiosClient } from "./axiosClient.js";

export async function listAdjuntos(pacienteId, historiaId) {
  const { data } = await axiosClient.get(`/api/pacientes/${pacienteId}/historias/${historiaId}/adjuntos`);
  return data;
}

export async function subirAdjunto(pacienteId, historiaId, file) {
  const formData = new FormData();
  formData.append("archivo", file);
  const { data } = await axiosClient.post(`/api/pacientes/${pacienteId}/historias/${historiaId}/adjuntos`, formData);
  return data;
}

export async function getUrlDescargaAdjunto(adjuntoId) {
  const { data } = await axiosClient.get(`/api/adjuntos/${adjuntoId}/url`);
  return data;
}

export async function deleteAdjunto(adjuntoId) {
  await axiosClient.delete(`/api/adjuntos/${adjuntoId}`);
}
