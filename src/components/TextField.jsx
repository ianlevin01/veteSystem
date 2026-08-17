import "./TextField.css";

function TextField({ id, label, error, ...inputProps }) {
  return (
    <div className="text-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={error ? "has-error" : undefined} {...inputProps} />
      {error && <span className="text-field-error">{error}</span>}
    </div>
  );
}

export default TextField;
