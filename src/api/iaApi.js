import { axiosClient } from "./axiosClient.js";

export async function extraerConsultaDeImagen(file) {
  const formData = new FormData();
  formData.append("imagen", file);
  const { data } = await axiosClient.post("/api/ia/extraer-consulta", formData);
  return data;
}
