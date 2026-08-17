export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-AR", { timeZone: "UTC" });
}

const UNIDAD_LABELS = {
  dia: ["día", "días"],
  semana: ["semana", "semanas"],
  mes: ["mes", "meses"],
  anio: ["año", "años"],
};

export function formatPlazo(cantidad, unidad) {
  const [singular, plural] = UNIDAD_LABELS[unidad] ?? [unidad, unidad];
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

export const ESTADO_RECORDATORIO_LABELS = {
  vencido: "Vencido",
  proximo: "Próximo a vencer",
  vigente: "Vigente",
};

export const ESTADO_RECORDATORIO_BADGE = {
  vencido: "badge-vencida",
  proximo: "badge-pendiente",
  vigente: "badge-completada",
};

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
