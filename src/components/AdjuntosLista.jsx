import { useEffect, useRef, useState } from "react";
import {
  listAdjuntos,
  subirAdjunto,
  listAnalisis,
  subirAnalisis,
  getUrlDescargaAdjunto,
  deleteAdjunto,
} from "../api/adjuntoApi.js";
import Button from "./Button.jsx";
import FormError from "./FormError.jsx";
import { IconPaperclip, IconUpload, IconTrash } from "./icons.jsx";
import { getErrorMessage } from "../utils/errors.js";
import "./AdjuntosLista.css";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif", "application/pdf"];
const EXTENSIONES_PERMITIDAS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif", ".pdf"];
const MAX_BYTES = 15 * 1024 * 1024;

// Las fotos sacadas directo con la camara del celular a veces llegan con un
// "type" MIME que no es exactamente el esperado: puede venir vacio,
// "application/octet-stream", o un alias no estandar como "image/jpg" (varios
// navegadores Android/Samsung lo informan asi para JPEGs), a diferencia de
// elegir una foto ya existente de la galeria. Por eso la extension del
// nombre de archivo es la señal principal, no el "type" reportado - el tipo
// solo sirve para aceptar rapido cuando coincide exactamente con la lista.
function tipoValido(file) {
  if (TIPOS_PERMITIDOS.includes(file.type)) return true;
  const nombre = (file.name || "").toLowerCase();
  if (EXTENSIONES_PERMITIDAS.some((ext) => nombre.endsWith(ext))) return true;
  return Boolean(file.type && file.type.startsWith("image/"));
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// pacienteId siempre requerido; historiaId presente = adjuntos de una consulta,
// ausente = analisis asociados directamente al paciente.
function AdjuntosLista({ pacienteId, historiaId }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const cargar = historiaId ? listAdjuntos(pacienteId, historiaId) : listAnalisis(pacienteId);
    cargar.then(setAdjuntos);
  }, [pacienteId, historiaId]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!tipoValido(file)) {
      setError(
        `Solo se permiten imágenes (jpg, png, webp, gif, heic) o PDF (archivo recibido: nombre="${file.name || "sin nombre"}", tipo="${file.type || "vacío"}")`
      );
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`El archivo no puede pesar más de 15MB (este mide ${formatBytes(file.size)})`);
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const subido = historiaId ? await subirAdjunto(pacienteId, historiaId, file) : await subirAnalisis(pacienteId, file);
      setAdjuntos((prev) => [...prev, subido]);
    } catch (err) {
      const diagnostico = err.response
        ? `HTTP ${err.response.status}: ${
            typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data ?? "")
          }`.slice(0, 200)
        : `sin respuesta del servidor (${err.code || "sin código"}: ${err.message})`;
      setError(`${getErrorMessage(err, "No se pudo subir el archivo")} — ${diagnostico}`);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleDescargar(adjuntoId) {
    // En mobile (sobre todo iOS Safari) un window.open() llamado despues de
    // un await ya no cuenta como "gesto del usuario" y el navegador lo
    // bloquea en silencio. Por eso abrimos la pestaña ANTES del await, y
    // recien despues le seteamos la url real.
    const nuevaVentana = window.open("", "_blank");
    try {
      const { url } = await getUrlDescargaAdjunto(adjuntoId);
      if (nuevaVentana) {
        nuevaVentana.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err) {
      if (nuevaVentana) nuevaVentana.close();
      setError(getErrorMessage(err, "No se pudo abrir el archivo"));
    }
  }

  async function handleEliminar(adjuntoId) {
    await deleteAdjunto(adjuntoId);
    setAdjuntos((prev) => prev.filter((a) => a.id !== adjuntoId));
  }

  return (
    <div className="adjuntos-lista-wrap">
      {adjuntos.length > 0 && (
        <ul className="adjuntos-lista">
          {adjuntos.map((a) => (
            <li key={a.id}>
              <IconPaperclip size={16} />
              <button type="button" className="adjuntos-nombre" onClick={() => handleDescargar(a.id)}>
                {a.nombreArchivo}
              </button>
              <span className="adjuntos-tamano">{formatBytes(a.tamanoBytes)}</span>
              <button type="button" className="adjuntos-eliminar" onClick={() => handleEliminar(a.id)} aria-label="Eliminar adjunto">
                <IconTrash size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="input-oculto"
        id={`adjuntos-input-${historiaId || pacienteId}`}
      />
      <Button type="button" variant="secondary" disabled={isUploading} onClick={() => inputRef.current?.click()}>
        <IconUpload size={16} />
        {isUploading ? "Subiendo..." : "Adjuntar archivo"}
      </Button>
      <FormError>{error}</FormError>
    </div>
  );
}

export default AdjuntosLista;
