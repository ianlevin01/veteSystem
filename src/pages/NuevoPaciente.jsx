import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { searchDuenios } from "../api/duenioApi.js";
import { createPaciente } from "../api/pacienteApi.js";
import Card from "../components/Card.jsx";
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import FormError from "../components/FormError.jsx";
import Select from "../components/Select.jsx";
import { IconArrowLeft, IconSearch, IconCheck } from "../components/icons.jsx";
import { getErrorMessage } from "../utils/errors.js";
import "./NuevoPaciente.css";

const ESPECIES = [
  { value: "Perro", label: "Perro" },
  { value: "Gato", label: "Gato" },
  { value: "Ave", label: "Ave" },
  { value: "Otro", label: "Otro" },
];

const SEXOS = [
  { value: "", label: "Sin especificar" },
  { value: "Macho", label: "Macho" },
  { value: "Hembra", label: "Hembra" },
];

const initialPaciente = {
  nombre: "",
  especie: "Perro",
  raza: "",
  sexo: "",
  fechaNacimiento: "",
  peso: "",
  color: "",
  esterilizado: false,
  microchip: "",
};

const initialDuenioNuevo = { nombre: "", telefono: "", email: "", direccion: "" };

function NuevoPaciente() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("existente");
  const [duenioQuery, setDuenioQuery] = useState("");
  const [duenioResultados, setDuenioResultados] = useState([]);
  const [duenioSeleccionado, setDuenioSeleccionado] = useState(null);
  const [duenioNuevo, setDuenioNuevo] = useState(initialDuenioNuevo);
  const [paciente, setPaciente] = useState(initialPaciente);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modo !== "existente") return undefined;
    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchDuenios(duenioQuery);
        setDuenioResultados(data);
      } catch {
        setDuenioResultados([]);
      }
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [duenioQuery, modo]);

  function updatePacienteField(field) {
    return (event) => {
      const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setPaciente((prev) => ({ ...prev, [field]: value }));
    };
  }

  function updateDuenioNuevoField(field) {
    return (event) => setDuenioNuevo((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (modo === "existente" && !duenioSeleccionado) {
      setError("Elegí un dueño de la lista o cargá uno nuevo");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...paciente,
        peso: paciente.peso ? Number(paciente.peso) : null,
        fechaNacimiento: paciente.fechaNacimiento || null,
        ...(modo === "existente" ? { duenioId: duenioSeleccionado.id } : { duenioNuevo }),
      };
      const creado = await createPaciente(payload);
      navigate(`/pacientes/${creado.id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear el paciente"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="nuevo-paciente">
      <div className="page-header">
        <div>
          <h1>Nuevo paciente</h1>
          <p>Carga los datos de la mascota y su dueño.</p>
        </div>
        <Link to="/pacientes" className="volver-link">
          <IconArrowLeft size={16} />
          Volver
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="nuevo-paciente-form">
        <div className="nuevo-paciente-grid">
          <Card className="nuevo-paciente-card">
            <h3>Dueño</h3>
            <div className="modo-toggle">
              <button
                type="button"
                className={modo === "existente" ? "active" : ""}
                onClick={() => setModo("existente")}
              >
                Dueño existente
              </button>
              <button type="button" className={modo === "nuevo" ? "active" : ""} onClick={() => setModo("nuevo")}>
                Dueño nuevo
              </button>
            </div>

            {modo === "existente" ? (
              <div className="duenio-picker">
                <div className="duenio-picker-search">
                  <IconSearch size={16} className="duenio-picker-icon" />
                  <input
                    type="search"
                    placeholder="Buscar dueño por nombre..."
                    value={duenioQuery}
                    onChange={(e) => {
                      setDuenioQuery(e.target.value);
                      setDuenioSeleccionado(null);
                    }}
                  />
                </div>
                {duenioSeleccionado ? (
                  <p className="duenio-seleccionado">
                    <IconCheck size={16} />
                    Seleccionado: <strong>{duenioSeleccionado.nombre}</strong>
                  </p>
                ) : (
                  duenioResultados.length > 0 && (
                    <ul className="duenio-resultados">
                      {duenioResultados.map((d) => (
                        <li key={d.id}>
                          <button type="button" onClick={() => setDuenioSeleccionado(d)}>
                            {d.nombre} {d.telefono ? `· ${d.telefono}` : ""}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            ) : (
              <div className="duenio-nuevo-fields">
                <TextField id="duenioNombre" label="Nombre" required value={duenioNuevo.nombre} onChange={updateDuenioNuevoField("nombre")} />
                <TextField id="duenioTelefono" label="Teléfono" value={duenioNuevo.telefono} onChange={updateDuenioNuevoField("telefono")} />
                <TextField id="duenioEmail" label="Email" type="email" value={duenioNuevo.email} onChange={updateDuenioNuevoField("email")} />
                <TextField id="duenioDireccion" label="Dirección" value={duenioNuevo.direccion} onChange={updateDuenioNuevoField("direccion")} />
              </div>
            )}
          </Card>

          <Card className="nuevo-paciente-card">
            <h3>Mascota</h3>
            <div className="paciente-grid">
              <TextField id="nombre" label="Nombre" required value={paciente.nombre} onChange={updatePacienteField("nombre")} />
              <Select
                id="especie"
                label="Especie"
                value={paciente.especie}
                onValueChange={(value) => setPaciente((prev) => ({ ...prev, especie: value }))}
                options={ESPECIES}
              />
              <TextField id="raza" label="Raza" value={paciente.raza} onChange={updatePacienteField("raza")} />
              <Select
                id="sexo"
                label="Sexo"
                value={paciente.sexo}
                onValueChange={(value) => setPaciente((prev) => ({ ...prev, sexo: value }))}
                options={SEXOS}
              />
              <TextField
                id="fechaNacimiento"
                label="Fecha de nacimiento"
                type="date"
                value={paciente.fechaNacimiento}
                onChange={updatePacienteField("fechaNacimiento")}
              />
              <TextField id="peso" label="Peso (kg)" type="number" step="0.1" min="0" value={paciente.peso} onChange={updatePacienteField("peso")} />
              <TextField id="color" label="Color" value={paciente.color} onChange={updatePacienteField("color")} />
              <TextField id="microchip" label="Microchip" value={paciente.microchip} onChange={updatePacienteField("microchip")} />
            </div>

            <label className="checkbox-field">
              <input type="checkbox" checked={paciente.esterilizado} onChange={updatePacienteField("esterilizado")} />
              Esterilizado
            </label>
          </Card>
        </div>

        <FormError>{error}</FormError>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Crear paciente"}
        </Button>
      </form>
    </div>
  );
}

export default NuevoPaciente;
