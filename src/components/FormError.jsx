import "./FormError.css";

function FormError({ children }) {
  if (!children) return null;
  return (
    <div className="form-error" role="alert">
      {children}
    </div>
  );
}

export default FormError;
