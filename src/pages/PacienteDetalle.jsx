import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPaciente } from "../api/pacienteApi.js";
import { listHistorias } from "../api/historiaClinicaApi.js";
import { listAlertasPaciente, createAlertaPaciente, updateAlerta, deleteAlerta } from "../api/alertaApi.js";
import { listRecordatoriosPaciente } from "../api/recordatorioApi.js";
import { getErrorMessage } from "../utils/errors.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import FormError from "../components/FormError.jsx";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconInbox,
  IconAlertTriangle,
  IconSyringe,
} from "../components/icons.jsx";
import { formatDate, ESTADO_RECORDATORIO_LABELS, ESTADO_RECORDATORIO_BADGE } from "../utils/format.js";
import "./PacienteDetalle.css";

function AlertasPaciente({ pacienteId, alertas, setAlertas }) {
  const [nueva, setNueva] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [error, setError] = useState(null);

  async function handleAgregar(e) {
    e.preventDefault();
    if (!nueva.trim()) return;
    try {
      const creada = await createAlertaPaciente(pacienteId, { descripcion: nueva.trim() });
      setAlertas((prev) => [creada, ...prev]);
      setNueva("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo agregar la alerta"));
    }
  }

  async function handleGuardarEdicion(id) {
    try {
      const actualizada = await updateAlerta(id, { descripcion: textoEdicion });
      setAlertas((prev) => prev.map((a) => (a.id === id ? actualizada : a)));
      setEditandoId(null);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo editar la alerta"));
    }
  }

  async function handleEliminar(id) {
    await deleteAlerta(id);
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <Card className="paciente-alertas">
      <div className="paciente-alertas-header">
        <IconAlertTriangle size={20} />
        <h3>Alertas de riesgo</h3>
      </div>

      {alertas.length === 0 ? (
        <p className="paciente-alertas-vacio">Sin alertas cargadas.</p>
      ) : (
        <ul className="paciente-alertas-lista">
          {alertas.map((a) =>
            editandoId === a.id ? (
              <li key={a.id}>
                <input
                  className="paciente-alertas-input"
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                  autoFocus
                />
                <div className="paciente-alertas-acciones">
                  <button type="button" onClick={() => handleGuardarEdicion(a.id)}>
                    Guardar
                  </button>
                  <button type="button" onClick={() => setEditandoId(null)}>
                    Cancelar
                  </button>
                </div>
              </li>
            ) : (
              <li key={a.id}>
                <span>{a.descripcion}</span>
                <div className="paciente-alertas-acciones">
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoId(a.id);
                      setTextoEdicion(a.descripcion);
                    }}
                  >
                    Editar
                  </button>
                  <button type="button" onClick={() => handleEliminar(a.id)}>
                    <IconTrash size={13} />
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <form className="paciente-alertas-form" onSubmit={handleAgregar}>
        <input
          className="paciente-alertas-input"
          placeholder="Ej: Paciente convulsivo"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <Button type="submit" variant="secondary" fullWidth>
          <IconPlus size={16} />
          Agregar
        </Button>
      </form>
      <FormError>{error}</FormError>
    </Card>
  );
}

function PacienteDetalle() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [historias, setHistorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      const [pacienteData, historiasData, alertasData, recordatoriosData] = await Promise.all([
        getPaciente(id),
        listHistorias(id),
        listAlertasPaciente(id),
        listRecordatoriosPaciente(id),
      ]);
      setPaciente(pacienteData);
      setHistorias(historiasData);
      setAlertas(alertasData);
      setRecordatorios(recordatoriosData);
    } catch {
      setError("No se pudo cargar el paciente");
    }
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  if (!paciente) {
    return <p>Cargando...</p>;
  }

  const historiasFiltradas = filtroFecha ? historias.filter((h) => h.fecha.slice(0, 10) === filtroFecha) : historias;

  return (
    <div className="paciente-detalle">
      <div className="page-header">
        <div>
          <h1>{paciente.nombre}</h1>
          <p>
            {paciente.especie}
            {paciente.raza ? ` · ${paciente.raza}` : ""}
            {paciente.sexo ? ` · ${paciente.sexo}` : ""}
          </p>
        </div>
        <Link to="/pacientes" className="volver-link">
          <IconArrowLeft size={16} />
          Volver a pacientes
        </Link>
      </div>

      <div className="paciente-detalle-grid">
        <div className="paciente-detalle-sidebar">
          <AlertasPaciente pacienteId={id} alertas={alertas} setAlertas={setAlertas} />

          <Card className="paciente-datos">
            <h3>Datos de la mascota</h3>
            <dl>
              <div>
                <dt>Fecha de nacimiento</dt>
                <dd>{formatDate(paciente.fechaNacimiento)}</dd>
              </div>
              <div>
                <dt>Peso</dt>
                <dd>{paciente.peso ? `${paciente.peso} kg` : "-"}</dd>
              </div>
              <div>
                <dt>Color</dt>
                <dd>{paciente.color || "-"}</dd>
              </div>
              <div>
                <dt>Esterilizado</dt>
                <dd>{paciente.esterilizado ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt>Microchip</dt>
                <dd>{paciente.microchip || "-"}</dd>
              </div>
            </dl>

            <h3>Dueño</h3>
            <dl>
              <div>
                <dt>Nombre</dt>
                <dd>{paciente.duenio.nombre}</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>{paciente.duenio.telefono || "-"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{paciente.duenio.email || "-"}</dd>
              </div>
              <div>
                <dt>Dirección</dt>
                <dd>{paciente.duenio.direccion || "-"}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="paciente-detalle-main">
          <Card className="paciente-section">
            <h3>Recordatorios</h3>
            {recordatorios.length === 0 ? (
              <div className="empty-state empty-state-rich">
                <IconSyringe size={28} />
                <p>Sin recordatorios activos.</p>
              </div>
            ) : (
              <ul className="recordatorios-paciente-lista">
                {recordatorios.map((r) => (
                  <li key={r.id}>
                    <div>
                      <strong>{r.item.nombre}</strong>
                      <span className="recordatorio-tipo"> · {r.item.tipo === "vacuna" ? "Vacuna" : "Medicamento"}</span>
                    </div>
                    <span className="recordatorio-fecha">vence {formatDate(r.fechaVencimiento)}</span>
                    <span className={`badge ${ESTADO_RECORDATORIO_BADGE[r.estado]}`}>{ESTADO_RECORDATORIO_LABELS[r.estado]}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="paciente-section">
            <div className="paciente-historial-header">
              <h3>Historial de consultas</h3>
              <div className="mobile-fab">
                <Link to={`/pacientes/${id}/consultas/nueva`}>
                  <Button>
                    <IconPlus size={16} />
                    Nueva consulta
                  </Button>
                </Link>
              </div>
            </div>

            <input
              className="paciente-historial-filtro"
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              aria-label="Filtrar por fecha"
            />
            {filtroFecha && (
              <button type="button" className="paciente-historial-filtro-limpiar" onClick={() => setFiltroFecha("")}>
                Limpiar filtro
              </button>
            )}

            <ul className="historias-list">
              {historiasFiltradas.length === 0 && (
                <li className="empty-state empty-state-rich">
                  <IconInbox size={28} />
                  <p>{filtroFecha ? "No hay consultas en esa fecha." : "Todavía no hay consultas registradas."}</p>
                </li>
              )}
              {historiasFiltradas.map((h) => (
                <li key={h.id}>
                  <Link to={`/pacientes/${id}/consultas/${h.id}`} className="historia-item-link">
                    <div className="historia-item-header">
                      <strong>{formatDate(h.fecha)}</strong>
                      <span>{h.motivo_consulta}</span>
                    </div>
                    {h.anamnesis && <p>{h.anamnesis}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <div className="mobile-fab-spacer" />
        </div>
      </div>
    </div>
  );
}

export default PacienteDetalle;
