import "./Button.css";

function Button({ variant = "primary", fullWidth = false, type = "button", disabled, children, className, ...rest }) {
  const classes = ["btn", `btn-${variant}`, fullWidth && "btn-full", className].filter(Boolean).join(" ");
  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
