import { useEffect, useMemo, useState } from "react";
import { listRecordatorioItems } from "../api/recordatorioItemApi.js";
import Button from "./Button.jsx";
import Select from "./Select.jsx";
import { IconPlus, IconTrash, IconSyringe } from "./icons.jsx";
import { formatDate, formatPlazo, todayIsoDate } from "../utils/format.js";
import { TIPOS_RECORDATORIO, UNIDADES_PLAZO } from "../utils/recordatorioConstants.js";
import "./ConsultaItemsPicker.css";

const draftInicial = { tipo: "vacuna", itemId: "", fechaAplicacion: todayIsoDate(), plazoCantidad: "", plazoUnidad: "" };

function ConsultaItemsPicker({ value, onChange }) {
  const [catalogo, setCatalogo] = useState([]);
  const [draft, setDraft] = useState(draftInicial);

  useEffect(() => {
    listRecordatorioItems({ soloActivos: true }).then(setCatalogo);
  }, []);

  const opcionesTipo = useMemo(() => catalogo.filter((i) => i.tipo === draft.tipo), [catalogo, draft.tipo]);

  function handleTipoChange(tipo) {
    setDraft({ ...draftInicial, tipo });
  }

  function handleItemChange(itemId) {
    const item = catalogo.find((i) => String(i.id) === itemId);
    setDraft((prev) => ({
      ...prev,
      itemId,
      plazoCantidad: item ? String(item.plazoCantidad) : "",
      plazoUnidad: item ? item.plazoUnidad : "",
    }));
  }

  function handleAgregar() {
    const item = catalogo.find((i) => String(i.id) === draft.itemId);
    if (!item || !draft.fechaAplicacion || !draft.plazoCantidad) return;
    onChange([
      ...value,
      {
        itemId: item.id,
        tipo: item.tipo,
        nombreItem: item.nombre,
        fechaAplicacion: draft.fechaAplicacion,
        plazoCantidad: Number(draft.plazoCantidad),
        plazoUnidad: draft.plazoUnidad,
      },
    ]);
    setDraft({ ...draftInicial, tipo: draft.tipo });
  }

  function handleQuitar(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="items-picker">
      <ul className="items-picker-lista">
        {value.length === 0 && <li className="items-picker-vacio">Todavía no agregaste ninguna vacuna ni medicamento.</li>}
        {value.map((item, index) => (
          <li key={`${item.itemId}-${index}`}>
            <IconSyringe size={16} />
            <div className="items-picker-item-info">
              <strong>{item.nombreItem}</strong>
              <span>
                Aplicada {formatDate(item.fechaAplicacion)} · vence en {formatPlazo(item.plazoCantidad, item.plazoUnidad)}
              </span>
            </div>
            <button type="button" onClick={() => handleQuitar(index)} aria-label="Quitar">
              <IconTrash size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="items-picker-draft">
        <p className="items-picker-draft-titulo">Agregar vacuna o medicamento</p>
        <div className="items-picker-draft-campos">
          <Select id="items-picker-tipo" label="Tipo" value={draft.tipo} onValueChange={handleTipoChange} options={TIPOS_RECORDATORIO} />

          <Select
            id="items-picker-item"
            label="Ítem"
            value={draft.itemId}
            onValueChange={handleItemChange}
            placeholder="Elegir..."
            options={opcionesTipo.map((i) => ({ value: String(i.id), label: i.nombre }))}
          />

          <div className="text-field">
            <label htmlFor="items-picker-fecha">Fecha de aplicación</label>
            <input
              id="items-picker-fecha"
              type="date"
              value={draft.fechaAplicacion}
              onChange={(e) => setDraft((prev) => ({ ...prev, fechaAplicacion: e.target.value }))}
            />
          </div>

          <div className="text-field">
            <label htmlFor="items-picker-plazo">Vence en</label>
            <div className="items-picker-plazo">
              <input
                id="items-picker-plazo"
                type="number"
                min="1"
                value={draft.plazoCantidad}
                onChange={(e) => setDraft((prev) => ({ ...prev, plazoCantidad: e.target.value }))}
              />
              <Select
                value={draft.plazoUnidad}
                onValueChange={(value) => setDraft((prev) => ({ ...prev, plazoUnidad: value }))}
                options={UNIDADES_PLAZO}
              />
            </div>
          </div>
        </div>

        <Button type="button" onClick={handleAgregar} disabled={!draft.itemId} fullWidth>
          <IconPlus size={16} />
          Agregar a la consulta
        </Button>
      </div>
    </div>
  );
}

export default ConsultaItemsPicker;
