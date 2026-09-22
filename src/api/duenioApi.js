import { axiosClient } from "./axiosClient.js";

export async function searchDuenios(query) {
  const { data } = await axiosClient.get("/api/duenios", { params: { query } });
  return data;
}

export async function updateDuenio(id, payload) {
  const { data } = await axiosClient.patch(`/api/duenios/${id}`, payload);
  return data;
}
