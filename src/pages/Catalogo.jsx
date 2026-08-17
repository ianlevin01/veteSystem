import { useEffect, useState } from "react";
import { listRecordatorioItems, createRecordatorioItem, updateRecordatorioItem } from "../api/recordatorioItemApi.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import TextField from "../components/TextField.jsx";
import FormError from "../components/FormError.jsx";
import Select from "../components/Select.jsx";
import { IconPlus, IconInbox } from "../components/icons.jsx";
import { formatPlazo } from "../utils/format.js";
import { UNIDADES_PLAZO } from "../utils/recordatorioConstants.js";
import "./Catalogo.css";

const TIPOS = [
  { value: "vacuna", label: "Vacunas" },
  { value: "medicamento", label: "Medicamentos" },
];

const formInicial = { nombre: "", plazoCantidad: "1", plazoUnidad: "anio" };

function ItemForm({ idPrefix, initial, onSubmit, onCancel, error }) {
  const [form, setForm] = useState(initial);

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, plazoCantidad: Number(form.plazoCantidad) });
  }

  return (
    <form className="catalogo-item-form" onSubmit={handleSubmit}>
      <TextField id={`${idPrefix}-nombre`} label="Nombre" required value={form.nombre} onChange={updateField("nombre")} />
      <TextField
        id={`${idPrefix}-plazo`}
        label="Plazo por defecto"
        type="number"
        min="1"
        required
        value={form.plazoCantidad}
        onChange={updateField("plazoCantidad")}
      />
      <Select
        id={`${idPrefix}-unidad`}
        label="Unidad"
        value={form.plazoUnidad}
        onValueChange={(value) => setForm((prev) => ({ ...prev, plazoUnidad: value }))}
        options={UNIDADES_PLAZO}
      />
      <div className="catalogo-item-form-acciones">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      <FormError>{error}</FormError>
    </form>
  );
}

function CatalogoSeccion({ tipo, label, items, onCreated, onUpdated }) {
  const [agregando, setAgregando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);

  async function handleCrear(valores) {
    setError(null);
    try {
      const creado = await createRecordatorioItem({ tipo, ...valores });
      onCreated(creado);
      setAgregando(false);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo crear el item");
    }
  }

  async function handleEditar(id, valores) {
    setError(null);
    try {
      const actualizado = await updateRecordatorioItem(id, { ...valores, activo: true });
      onUpdated(actualizado);
      setEditandoId(null);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo actualizar el item");
    }
  }

  async function handleToggleActivo(item) {
    const actualizado = await updateRecordatorioItem(item.id, {
      nombre: item.nombre,
      plazoCantidad: item.plazoCantidad,
      plazoUnidad: item.plazoUnidad,
      activo: !item.activo,
    });
    onUpdated(actualizado);
  }

  return (
    <Card className="catalogo-seccion">
      <div className="catalogo-seccion-header">
        <h3>{label}</h3>
        {!agregando && (
          <Button variant="secondary" onClick={() => setAgregando(true)}>
            <IconPlus size={16} />
            Agregar
          </Button>
        )}
      </div>

      {agregando && (
        <ItemForm
          idPrefix={`${tipo}-nuevo`}
          initial={formInicial}
          onSubmit={handleCrear}
          onCancel={() => setAgregando(false)}
          error={error}
        />
      )}

      {items.length === 0 && !agregando && (
        <div className="empty-state empty-state-rich">
          <IconInbox size={28} />
          <p>Todavía no hay {label.toLowerCase()} cargados.</p>
        </div>
      )}

      <ul className="catalogo-lista">
        {items.map((item) =>
          editandoId === item.id ? (
            <li key={item.id}>
              <ItemForm
                idPrefix={`${tipo}-${item.id}`}
                initial={{ nombre: item.nombre, plazoCantidad: String(item.plazoCantidad), plazoUnidad: item.plazoUnidad }}
                onSubmit={(valores) => handleEditar(item.id, valores)}
                onCancel={() => setEditandoId(null)}
                error={error}
              />
            </li>
          ) : (
            <li key={item.id} className={item.activo ? "" : "catalogo-item-inactivo"}>
              <div>
                <strong>{item.nombre}</strong>
                <span className="catalogo-item-plazo"> · cada {formatPlazo(item.plazoCantidad, item.plazoUnidad)}</span>
                {!item.activo && <span className="badge badge-vencida">Inactivo</span>}
              </div>
              <div className="catalogo-item-acciones">
                <button type="button" onClick={() => setEditandoId(item.id)}>
                  Editar
                </button>
                <button type="button" className={item.activo ? "danger" : ""} onClick={() => handleToggleActivo(item)}>
                  {item.activo ? "Desactivar" : "Reactivar"}
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </Card>
  );
}

function Catalogo() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listRecordatorioItems().then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  }, []);

  function handleCreated(item) {
    setItems((prev) => [...prev, item]);
  }

  function handleUpdated(item) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Catálogo</h1>
          <p>Vacunas y medicamentos disponibles para aplicar en las consultas.</p>
        </div>
      </div>

      {!isLoading && (
        <div className="catalogo-grid">
          {TIPOS.map((t) => (
            <CatalogoSeccion
              key={t.value}
              tipo={t.value}
              label={t.label}
              items={items.filter((i) => i.tipo === t.value)}
              onCreated={handleCreated}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
