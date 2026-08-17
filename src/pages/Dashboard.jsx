import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { searchPacientes } from "../api/pacienteApi.js";
import { listRecordatorios } from "../api/recordatorioApi.js";
import Card from "../components/Card.jsx";
import { IconPaw, IconBell, IconPlus } from "../components/icons.jsx";
import "./Dashboard.css";

function Dashboard() {
  const { usuario, veterinaria } = useAuth();
  const [totalPacientes, setTotalPacientes] = useState(null);
  const [recordatoriosVencidos, setRecordatoriosVencidos] = useState([]);
  const [recordatoriosProximos, setRecordatoriosProximos] = useState([]);

  useEffect(() => {
    searchPacientes("").then((data) => setTotalPacientes(data.length));
    listRecordatorios("vencido").then(setRecordatoriosVencidos);
    listRecordatorios("proximo").then(setRecordatoriosProximos);
  }, []);

  const pendientes = recordatoriosVencidos.length + recordatoriosProximos.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Hola, {usuario?.nombre}</h1>
        <p>Este es el panel de {veterinaria?.nombre}.</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/pacientes" className="dashboard-card-link">
          <Card className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-primary">
              <IconPaw size={20} />
            </div>
            <h3>Pacientes</h3>
            <p className="dashboard-stat">{totalPacientes ?? "-"}</p>
            <p>Mascotas registradas</p>
          </Card>
        </Link>

        <Link to="/recordatorios" className="dashboard-card-link">
          <Card className="dashboard-card">
            <div
              className={`dashboard-card-icon ${recordatoriosVencidos.length > 0 ? "dashboard-card-icon-danger" : "dashboard-card-icon-primary"}`}
            >
              <IconBell size={20} />
            </div>
            <h3>Recordatorios</h3>
            <p className="dashboard-stat">{pendientes}</p>
            <p>{recordatoriosVencidos.length > 0 ? `${recordatoriosVencidos.length} vencidos` : "Al día"}</p>
          </Card>
        </Link>

        <Link to="/pacientes/nuevo" className="dashboard-card-link">
          <Card className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-accent">
              <IconPlus size={20} />
            </div>
            <h3>Nuevo paciente</h3>
            <p>Registra una mascota y su dueño.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
