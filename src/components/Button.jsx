import "./Button.css";

function Button({ variant = "primary", fullWidth = false, type = "button", disabled, children, ...rest }) {
  const className = ["btn", `btn-${variant}`, fullWidth && "btn-full"].filter(Boolean).join(" ");
  return (
    <button type={type} className={className} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
