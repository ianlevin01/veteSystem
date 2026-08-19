import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";
import FormError from "../components/FormError.jsx";
import { getErrorMessage } from "../utils/errors.js";

const initialForm = {
  veterinariaNombre: "",
  veterinariaEmail: "",
  usuarioNombre: "",
  usuarioEmail: "",
  password: "",
};

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        veterinaria: { nombre: form.veterinariaNombre, email: form.veterinariaEmail },
        usuario: { nombre: form.usuarioNombre, email: form.usuarioEmail, password: form.password },
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo completar el registro"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Registrá tu veterinaria" subtitle="Creá la cuenta de tu clínica en un par de minutos">
      <form className="auth-form" onSubmit={handleSubmit}>
        <fieldset className="auth-fieldset">
          <legend>Veterinaria</legend>
          <TextField
            id="veterinariaNombre"
            label="Nombre"
            required
            value={form.veterinariaNombre}
            onChange={updateField("veterinariaNombre")}
          />
          <TextField
            id="veterinariaEmail"
            label="Email"
            type="email"
            required
            value={form.veterinariaEmail}
            onChange={updateField("veterinariaEmail")}
          />
        </fieldset>

        <fieldset className="auth-fieldset">
          <legend>Usuario administrador</legend>
          <TextField
            id="usuarioNombre"
            label="Nombre"
            required
            value={form.usuarioNombre}
            onChange={updateField("usuarioNombre")}
          />
          <TextField
            id="usuarioEmail"
            label="Email"
            type="email"
            required
            value={form.usuarioEmail}
            onChange={updateField("usuarioEmail")}
          />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={updateField("password")}
          />
        </fieldset>

        <FormError>{error}</FormError>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
      <p className="auth-footer">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
