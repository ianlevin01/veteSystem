import { Component } from "react";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error no controlado:", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="error-boundary">
        <Card className="error-boundary-card">
          <h1>Algo salió mal</h1>
          <p>Ocurrió un error inesperado. Probá recargar la página; si el problema sigue, avisanos.</p>
          <Button onClick={() => window.location.reload()}>Recargar página</Button>
        </Card>
      </div>
    );
  }
}

export default ErrorBoundary;
