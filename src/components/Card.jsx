import "./Card.css";

function Card({ children, className, ...rest }) {
  const classNames = ["card", className].filter(Boolean).join(" ");
  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
}

export default Card;
