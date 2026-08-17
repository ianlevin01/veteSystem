import { axiosClient } from "./axiosClient.js";

export async function listRecordatorioItems({ tipo, query, soloActivos } = {}) {
  const { data } = await axiosClient.get("/api/recordatorio-items", { params: { tipo, query, soloActivos } });
  return data;
}

export async function createRecordatorioItem(payload) {
  const { data } = await axiosClient.post("/api/recordatorio-items", payload);
  return data;
}

export async function updateRecordatorioItem(id, payload) {
  const { data } = await axiosClient.patch(`/api/recordatorio-items/${id}`, payload);
  return data;
}
