import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listRecordatorios, deleteRecordatorio } from "../api/recordatorioApi.js";
import { formatDate, ESTADO_RECORDATORIO_LABELS, ESTADO_RECORDATORIO_BADGE } from "../utils/format.js";
import { IconTrash, IconInbox } from "../components/icons.jsx";
import "./Recordatorios.css";

const FILTROS = [
  { value: "", label: "Todos" },
  { value: "vencido", label: "Vencidos" },
  { value: "proximo", label: "Próximos" },
  { value: "vigente", label: "Vigentes" },
];

function Recordatorios() {
  const [filtro, setFiltro] = useState("vencido");
  const [recordatorios, setRecordatorios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setIsLoading(true);
    setError(null);
    listRecordatorios(filtro)
      .then((data) => {
        if (!cancelado) setRecordatorios(data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar los recordatorios");
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false);
      });
    return () => {
      cancelado = true;
    };
  }, [filtro]);

  async function handleEliminar(id) {
    await deleteRecordatorio(id);
    setRecordatorios((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Recordatorios</h1>
          <p>Vacunas y medicamentos con vencimiento por paciente. Se actualizan al cargar una nueva consulta.</p>
        </div>
      </div>

      <div className="recordatorios-filtros">
        {FILTROS.map((f) => (
          <button key={f.value} className={filtro === f.value ? "active" : ""} onClick={() => setFiltro(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        {error && <div className="empty-state">{error}</div>}
        {!error && !isLoading && recordatorios.length === 0 && (
          <div className="empty-state empty-state-rich">
            <IconInbox size={32} />
            <p>No hay recordatorios para este filtro.</p>
          </div>
        )}
        {!error && recordatorios.length > 0 && (
          <table className="recordatorios-table">
            <thead>
              <tr>
                <th>Vence</th>
                <th>Ítem</th>
                <th>Paciente</th>
                <th>Dueño</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recordatorios.map((r) => (
                <tr key={r.id}>
                  <td data-label="Vence">{formatDate(r.fechaVencimiento)}</td>
                  <td data-label="Ítem">
                    {r.item.nombre}
                    <span className="recordatorio-tipo"> · {r.item.tipo === "vacuna" ? "Vacuna" : "Medicamento"}</span>
                  </td>
                  <td data-label="Paciente">
                    <Link to={`/pacientes/${r.paciente.id}`}>{r.paciente.nombre}</Link>
                  </td>
                  <td data-label="Dueño">{r.paciente.duenioNombre}</td>
                  <td data-label="Estado">
                    <span className={`badge ${ESTADO_RECORDATORIO_BADGE[r.estado]}`}>{ESTADO_RECORDATORIO_LABELS[r.estado]}</span>
                  </td>
                  <td className="recordatorios-acciones">
                    <button type="button" className="danger" onClick={() => handleEliminar(r.id)}>
                      <IconTrash size={14} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Recordatorios;
