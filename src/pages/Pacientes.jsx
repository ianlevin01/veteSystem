import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchPacientes } from "../api/pacienteApi.js";
import Button from "../components/Button.jsx";
import { IconSearch, IconPlus, IconInbox } from "../components/icons.jsx";
import "./Pacientes.css";

function Pacientes() {
  const [query, setQuery] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchPacientes(query);
        setPacientes(data);
      } catch {
        setError("No se pudieron cargar los pacientes");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <p>Busca por nombre de la mascota o de su dueño.</p>
        </div>
        <Link to="/pacientes/nuevo">
          <Button>
            <IconPlus size={16} />
            Nuevo paciente
          </Button>
        </Link>
      </div>

      <div className="pacientes-search-wrapper">
        <IconSearch size={16} className="pacientes-search-icon" />
        <input
          className="pacientes-search"
          type="search"
          placeholder="Buscar por mascota o dueño..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        {error && <div className="empty-state">{error}</div>}
        {!error && !isLoading && pacientes.length === 0 && (
          <div className="empty-state empty-state-rich">
            <IconInbox size={32} />
            <p>No se encontraron pacientes.</p>
          </div>
        )}
        {!error && pacientes.length > 0 && (
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Especie / Raza</th>
                <th>Dueño</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td data-label="Mascota">
                    <Link to={`/pacientes/${p.id}`}>{p.nombre}</Link>
                  </td>
                  <td data-label="Especie / Raza">
                    <span className="especie-badge">{p.especie}</span>
                    {p.raza ? ` ${p.raza}` : ""}
                  </td>
                  <td data-label="Dueño">{p.duenio.nombre}</td>
                  <td data-label="Teléfono">{p.duenio.telefono || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Pacientes;
