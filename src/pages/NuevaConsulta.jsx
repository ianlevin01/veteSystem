import { useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createHistoria } from "../api/historiaClinicaApi.js";
import { extraerConsultaDeImagen } from "../api/iaApi.js";
import Card from "../components/Card.jsx";
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import FormError from "../components/FormError.jsx";
import ConsultaItemsPicker from "../components/ConsultaItemsPicker.jsx";
import DeteccionItemIA from "../components/DeteccionItemIA.jsx";
import { IconArrowLeft, IconSparkle, IconUpload } from "../components/icons.jsx";
import { todayIsoDate } from "../utils/format.js";
import { getErrorMessage } from "../utils/errors.js";
import "./ConsultaForm.css";

const formInicial = {
  fecha: todayIsoDate(),
  motivoConsulta: "",
  anamnesis: "",
  tratamiento: "",
  diagnosticoPresuntivo: "",
  pesoRegistrado: "",
};

const TIPOS_IMAGEN_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES_IMAGEN = 15 * 1024 * 1024;

function NuevaConsulta() {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(formInicial);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAnalizando, setIsAnalizando] = useState(false);
  const [errorIA, setErrorIA] = useState(null);
  const [deteccionesPendientes, setDeteccionesPendientes] = useState([]);
  const inputIARef = useRef(null);

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleArchivoIA(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setErrorIA(null);

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.type)) {
      setErrorIA("Solo se permiten fotos en jpg, png o webp");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES_IMAGEN) {
      setErrorIA("La foto no puede pesar más de 15MB");
      event.target.value = "";
      return;
    }

    setIsAnalizando(true);
    try {
      const resultado = await extraerConsultaDeImagen(file);
      setForm((prev) => ({
        fecha: resultado.fecha || prev.fecha,
        motivoConsulta: resultado.motivoConsulta || prev.motivoConsulta,
        anamnesis: resultado.anamnesis || prev.anamnesis,
        tratamiento: resultado.tratamiento || prev.tratamiento,
        diagnosticoPresuntivo: resultado.diagnosticoPresuntivo || prev.diagnosticoPresuntivo,
        pesoRegistrado: resultado.pesoRegistrado ?? prev.pesoRegistrado,
      }));
      setDeteccionesPendientes(resultado.itemsDetectados || []);
    } catch (err) {
      setErrorIA(getErrorMessage(err, "No se pudo analizar la imagen"));
    } finally {
      setIsAnalizando(false);
      event.target.value = "";
    }
  }

  function handleResolverDeteccion(index, resuelto) {
    setDeteccionesPendientes((prev) => prev.filter((_, i) => i !== index));
    if (resuelto) {
      setItems((prev) => [...prev, resuelto]);
    }
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
      const creada = await createHistoria(pacienteId, payload);
      navigate(`/pacientes/${pacienteId}/consultas/${creada.id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar la consulta"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="consulta-form-page">
      <div className="page-header">
        <div>
          <h1>Nueva consulta</h1>
        </div>
        <Link to={`/pacientes/${pacienteId}`} className="volver-link">
          <IconArrowLeft size={16} />
          Volver a la ficha
        </Link>
      </div>

      <Card className="consulta-ia-card">
        <div className="consulta-ia-card-info">
          <IconSparkle size={20} />
          <div>
            <strong>Cargar ficha vieja con IA</strong>
            <span>Sacale una foto a la ficha en papel y completamos el formulario automáticamente para que lo revises.</span>
          </div>
        </div>
        <input
          ref={inputIARef}
          type="file"
          accept={TIPOS_IMAGEN_PERMITIDOS.join(",")}
          capture="environment"
          onChange={handleArchivoIA}
          className="input-oculto"
        />
        <Button type="button" variant="secondary" disabled={isAnalizando} onClick={() => inputIARef.current?.click()}>
          <IconUpload size={16} />
          {isAnalizando ? "Analizando imagen..." : "Subir foto"}
        </Button>
        <FormError>{errorIA}</FormError>
      </Card>

      {deteccionesPendientes.length > 0 && (
        <div className="consulta-detecciones-ia">
          {deteccionesPendientes.map((deteccion, index) => (
            <DeteccionItemIA
              key={`${deteccion.tipo}-${deteccion.textoOriginal}-${index}`}
              deteccion={deteccion}
              fechaConsulta={form.fecha}
              onResolver={(resuelto) => handleResolverDeteccion(index, resuelto)}
            />
          ))}
        </div>
      )}

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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar consulta"}
        </Button>
        <p className="consulta-form-nota">Podés adjuntar imágenes o PDFs después de guardar la consulta.</p>
      </form>
    </div>
  );
}

export default NuevaConsulta;
