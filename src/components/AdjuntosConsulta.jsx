import { useEffect, useRef, useState } from "react";
import { listAdjuntos, subirAdjunto, getUrlDescargaAdjunto, deleteAdjunto } from "../api/adjuntoApi.js";
import Button from "./Button.jsx";
import FormError from "./FormError.jsx";
import { IconPaperclip, IconUpload, IconTrash } from "./icons.jsx";
import { getErrorMessage } from "../utils/errors.js";
import "./AdjuntosConsulta.css";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif", "application/pdf"];
const EXTENSIONES_PERMITIDAS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif", ".pdf"];
const MAX_BYTES = 15 * 1024 * 1024;

// Las fotos sacadas directo con la camara del celular a veces llegan sin un
// "type" MIME valido (algunos navegadores mandan "" o "application/octet-stream"
// en ese caso, a diferencia de elegir una foto ya existente de la galeria). En
// vez de rechazarlas de entrada, si el tipo no es reconocible miramos la
// extension del nombre de archivo antes de bloquear la subida.
function tipoValido(file) {
  if (TIPOS_PERMITIDOS.includes(file.type)) return true;
  if (file.type && file.type !== "application/octet-stream") return false;
  const nombre = (file.name || "").toLowerCase();
  return EXTENSIONES_PERMITIDAS.some((ext) => nombre.endsWith(ext));
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AdjuntosConsulta({ pacienteId, historiaId }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listAdjuntos(pacienteId, historiaId).then(setAdjuntos);
  }, [pacienteId, historiaId]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!tipoValido(file)) {
      setError("Solo se permiten imágenes (jpg, png, webp, gif, heic) o PDF");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El archivo no puede pesar más de 15MB");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const subido = await subirAdjunto(pacienteId, historiaId, file);
      setAdjuntos((prev) => [...prev, subido]);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo subir el archivo"));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleDescargar(adjuntoId) {
    const { url } = await getUrlDescargaAdjunto(adjuntoId);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleEliminar(adjuntoId) {
    await deleteAdjunto(adjuntoId);
    setAdjuntos((prev) => prev.filter((a) => a.id !== adjuntoId));
  }

  return (
    <div className="adjuntos-consulta">
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
        id="adjuntos-input"
      />
      <Button type="button" variant="secondary" disabled={isUploading} onClick={() => inputRef.current?.click()}>
        <IconUpload size={16} />
        {isUploading ? "Subiendo..." : "Adjuntar archivo"}
      </Button>
      <FormError>{error}</FormError>
    </div>
  );
}

export default AdjuntosConsulta;
