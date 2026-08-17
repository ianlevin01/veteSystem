import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";
import { IconHome, IconPaw, IconBell, IconClipboard, IconMenu, IconClose } from "./icons.jsx";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/", end: true, label: "Dashboard", icon: IconHome },
  { to: "/pacientes", end: false, label: "Pacientes", icon: IconPaw },
  { to: "/recordatorios", end: false, label: "Recordatorios", icon: IconBell },
  { to: "/catalogo", end: false, label: "Catálogo", icon: IconClipboard },
];

function navLinkClass({ isActive }) {
  return isActive ? "navbar-link active" : "navbar-link";
}

function iniciales(nombre) {
  if (!nombre) return "";
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Navbar() {
  const { usuario, veterinaria, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Logo size="sm" />
        <nav className="navbar-nav">
          {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="navbar-right">
        <div className="navbar-identity">
          <span className="navbar-veterinaria">{veterinaria?.nombre}</span>
          <span className="navbar-usuario">{usuario?.nombre}</span>
        </div>
        <div className="navbar-avatar" aria-hidden="true">
          {iniciales(usuario?.nombre)}
        </div>
        <Button variant="secondary" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={menuAbierto ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((prev) => !prev)}
      >
        {menuAbierto ? <IconClose /> : <IconMenu />}
      </button>

      {menuAbierto && (
        <div className="navbar-mobile-menu">
          <nav className="navbar-nav navbar-nav-mobile">
            {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={() => setMenuAbierto(false)}>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="navbar-mobile-footer">
            <div className="navbar-identity navbar-identity-mobile">
              <span className="navbar-veterinaria">{veterinaria?.nombre}</span>
              <span className="navbar-usuario">{usuario?.nombre}</span>
            </div>
            <Button variant="secondary" fullWidth onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
