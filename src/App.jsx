import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pacientes from "./pages/Pacientes.jsx";
import NuevoPaciente from "./pages/NuevoPaciente.jsx";
import PacienteDetalle from "./pages/PacienteDetalle.jsx";
import NuevaConsulta from "./pages/NuevaConsulta.jsx";
import ConsultaDetalle from "./pages/ConsultaDetalle.jsx";
import Recordatorios from "./pages/Recordatorios.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/nuevo" element={<NuevoPaciente />} />
            <Route path="/pacientes/:id" element={<PacienteDetalle />} />
            <Route path="/pacientes/:id/consultas/nueva" element={<NuevaConsulta />} />
            <Route path="/pacientes/:id/consultas/:consultaId" element={<ConsultaDetalle />} />
            <Route path="/recordatorios" element={<Recordatorios />} />
            <Route path="/catalogo" element={<Catalogo />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
