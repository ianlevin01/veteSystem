import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getHistoria, updateHistoria, deleteHistoria } from "../api/historiaClinicaApi.js";
import Card from "../components/Card.jsx";
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import FormError from "../components/FormError.jsx";
import ConsultaItemsPicker from "../components/ConsultaItemsPicker.jsx";
import AdjuntosConsulta from "../components/AdjuntosConsulta.jsx";
import { IconArrowLeft, IconSyringe, IconTrash } from "../components/icons.jsx";
import { formatDate, formatPlazo } from "../utils/format.js";
import "./ConsultaForm.css";

function historiaAForm(historia) {
  return {
    fecha: historia.fecha.slice(0, 10),
    motivoConsulta: historia.motivo_consulta,
    anamnesis: historia.anamnesis,
    tratamiento: historia.tratamiento || "",
    diagnosticoPresuntivo: historia.diagnostico_presuntivo || "",
    pesoRegistrado: historia.peso_registrado ?? "",
  };
}

function historiaAItems(historia) {
  return historia.items.map((item) => ({
    itemId: item.item_id,
    tipo: item.tipo,
    nombreItem: item.nombre,
    fechaAplicacion: item.fecha_aplicacion.slice(0, 10),
    plazoCantidad: item.plazo_cantidad,
    plazoUnidad: item.plazo_unidad,
  }));
}

function ConsultaDetalle() {
  const { id: pacienteId, consultaId } = useParams();
  const navigate = useNavigate();
  const [historia, setHistoria] = useState(null);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState(null);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getHistoria(pacienteId, consultaId).then((data) => {
      setHistoria(data);
      setForm(historiaAForm(data));
      setItems(historiaAItems(data));
    });
  }, [pacienteId, consultaId]);

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!form.motivoConsulta || !form.anamnesis) {
      setError("Motivo de consulta y anamnesis son requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        pesoRegistrado: form.pesoRegistrado ? Number(form.pesoRegistrado) : null,
        items: items.map(({ itemId, fechaAplicacion, plazoCantidad, plazoUnidad }) => ({
          itemId,
          fechaAplicacion,
          plazoCantidad,
          plazoUnidad,
        })),
      };
      const actualizada = await updateHistoria(pacienteId, consultaId, payload);
      setHistoria(actualizada);
      setForm(historiaAForm(actualizada));
      setItems(historiaAItems(actualizada));
      setModoEdicion(false);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar la consulta");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEliminar() {
    if (!window.confirm("¿Eliminar esta consulta? Si tenia vacunas o medicamentos aplicados, el recordatorio del paciente se va a recalcular.")) {
      return;
    }
    await deleteHistoria(pacienteId, consultaId);
    navigate(`/pacientes/${pacienteId}`, { replace: true });
  }

  if (!historia) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="consulta-form-page">
      <div className="page-header">
        <div>
          <h1>Consulta del {formatDate(historia.fecha)}</h1>
        </div>
        <Link to={`/pacientes/${pacienteId}`} className="volver-link">
          <IconArrowLeft size={16} />
          Volver a la ficha
        </Link>
      </div>

      <div className="consulta-form">
        <Card className="consulta-form-card">
          <h3>Archivos adjuntos</h3>
          <AdjuntosConsulta pacienteId={pacienteId} historiaId={consultaId} />
        </Card>
      </div>

      {!modoEdicion ? (
        <div className="consulta-form">
          <div className="consulta-form-layout">
            <Card className="consulta-form-card">
              <dl className="consulta-detalle-dl">
                <div>
                  <dt>Motivo de consulta</dt>
                  <dd>{historia.motivo_consulta}</dd>
                </div>
                <div>
                  <dt>Anamnesis</dt>
                  <dd>{historia.anamnesis}</dd>
                </div>
                {historia.tratamiento && (
                  <div>
                    <dt>Tratamiento</dt>
                    <dd>{historia.tratamiento}</dd>
                  </div>
                )}
                {historia.diagnostico_presuntivo && (
                  <div>
                    <dt>Diagnóstico presuntivo</dt>
                    <dd>{historia.diagnostico_presuntivo}</dd>
                  </div>
                )}
                {historia.peso_registrado && (
                  <div>
                    <dt>Peso</dt>
                    <dd>{historia.peso_registrado} kg</dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card className="consulta-form-card">
              <h3>Vacunas y medicamentos aplicados</h3>
              {items.length === 0 ? (
                <p className="consulta-form-nota">No se aplicó ninguna vacuna ni medicamento en esta consulta.</p>
              ) : (
                <ul className="items-picker-lista">
                  {items.map((item, index) => (
                    <li key={`${item.itemId}-${index}`}>
                      <IconSyringe size={16} />
                      <div className="items-picker-item-info">
                        <strong>{item.nombreItem}</strong>
                        <span>
                          Aplicada {formatDate(item.fechaAplicacion)} · vence en {formatPlazo(item.plazoCantidad, item.plazoUnidad)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="consulta-detalle-acciones">
            <Button onClick={() => setModoEdicion(true)}>Editar consulta</Button>
            <Button variant="danger" onClick={handleEliminar}>
              <IconTrash size={16} />
              Eliminar consulta
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="consulta-form">
          <div className="consulta-form-layout">
            <Card className="consulta-form-card">
              <div className="consulta-form-grid">
                <TextField id="fecha" label="Fecha" type="date" required value={form.fecha} onChange={updateField("fecha")} />
                <TextField
                  id="motivoConsulta"
                  label="Motivo de consulta"
                  required
                  value={form.motivoConsulta}
                  onChange={updateField("motivoConsulta")}
                />
                <TextField id="pesoRegistrado" label="Peso (kg)" type="number" step="0.1" value={form.pesoRegistrado} onChange={updateField("pesoRegistrado")} />
              </div>

              <div className="text-field">
                <label htmlFor="anamnesis">Anamnesis</label>
                <textarea id="anamnesis" required value={form.anamnesis} onChange={updateField("anamnesis")} />
              </div>
              <div className="text-field">
                <label htmlFor="tratamiento">Tratamiento</label>
                <textarea id="tratamiento" value={form.tratamiento} onChange={updateField("tratamiento")} />
              </div>
              <div className="text-field">
                <label htmlFor="diagnosticoPresuntivo">Diagnóstico presuntivo</label>
                <textarea id="diagnosticoPresuntivo" value={form.diagnosticoPresuntivo} onChange={updateField("diagnosticoPresuntivo")} />
              </div>
            </Card>

            <Card className="consulta-form-card">
              <h3>Vacunas y medicamentos aplicados</h3>
              <ConsultaItemsPicker value={items} onChange={setItems} />
            </Card>
          </div>

          <FormError>{error}</FormError>

          <div className="consulta-detalle-acciones">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModoEdicion(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ConsultaDetalle;
