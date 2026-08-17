import { useEffect, useState } from "react";
import { listRecordatorioItems } from "../api/recordatorioItemApi.js";
import Card from "./Card.jsx";
import Button from "./Button.jsx";
import Select from "./Select.jsx";
import { IconSparkle } from "./icons.jsx";
import "./DeteccionItemIA.css";

function DeteccionItemIA({ deteccion, fechaConsulta, onResolver }) {
  const [catalogo, setCatalogo] = useState([]);
  const [eligiendoOtro, setEligiendoOtro] = useState(false);
  const [fechaAplicacion, setFechaAplicacion] = useState(deteccion.fechaAplicacion || fechaConsulta);

  useEffect(() => {
    listRecordatorioItems({ tipo: deteccion.tipo, soloActivos: true }).then(setCatalogo);
  }, [deteccion.tipo]);

  function confirmar(itemId) {
    const item = catalogo.find((i) => String(i.id) === String(itemId));
    if (!item) return;
    onResolver({
      itemId: item.id,
      tipo: item.tipo,
      nombreItem: item.nombre,
      fechaAplicacion,
      plazoCantidad: item.plazoCantidad,
      plazoUnidad: item.plazoUnidad,
    });
  }

  const etiquetaTipo = deteccion.tipo === "vacuna" ? "vacuna" : "medicamento";

  return (
    <Card className="deteccion-ia">
      <div className="deteccion-ia-header">
        <IconSparkle size={18} />
        <div>
          <strong>La IA detectó "{deteccion.textoOriginal}"</strong>
          <span>Confirmá qué {etiquetaTipo} del catálogo fue, o descartalo.</span>
        </div>
      </div>

      {deteccion.candidatos.length > 0 && !eligiendoOtro && (
        <div className="deteccion-ia-candidatos">
          {deteccion.candidatos.map((c) => (
            <button key={c.itemId} type="button" onClick={() => confirmar(c.itemId)}>
              {c.nombre}
            </button>
          ))}
        </div>
      )}

      {eligiendoOtro || deteccion.candidatos.length === 0 ? (
        <Select
          label={`Elegir ${etiquetaTipo} del catálogo`}
          value=""
          onValueChange={confirmar}
          placeholder="Elegir..."
          options={catalogo.map((i) => ({ value: String(i.id), label: i.nombre }))}
        />
      ) : (
        <button type="button" className="deteccion-ia-otro-link" onClick={() => setEligiendoOtro(true)}>
          Elegir otro ítem del catálogo
        </button>
      )}

      <div className="text-field">
        <label htmlFor={`deteccion-fecha-${deteccion.textoOriginal}`}>Fecha de aplicación</label>
        <input
          id={`deteccion-fecha-${deteccion.textoOriginal}`}
          type="date"
          value={fechaAplicacion}
          onChange={(e) => setFechaAplicacion(e.target.value)}
        />
      </div>

      <Button type="button" variant="secondary" onClick={() => onResolver(null)}>
        No se aplicó {deteccion.tipo === "vacuna" ? "ninguna vacuna" : "ningún medicamento"}
      </Button>
    </Card>
  );
}

export default DeteccionItemIA;
