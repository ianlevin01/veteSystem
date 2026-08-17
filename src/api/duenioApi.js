import { axiosClient } from "./axiosClient.js";

export async function searchDuenios(query) {
  const { data } = await axiosClient.get("/api/duenios", { params: { query } });
  return data;
}
