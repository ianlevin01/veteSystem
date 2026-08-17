import Logo from "./Logo.jsx";
import Card from "./Card.jsx";
import "./AuthLayout.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout-inner">
        <Logo />
        <Card className="auth-card">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </Card>
      </div>
    </div>
  );
}

export default AuthLayout;
