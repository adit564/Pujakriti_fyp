import { useNavigate } from "react-router-dom";
import "../styles/error.css";

export default function NotFoundError() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-graphic">
          <div className="error-circle">4</div>
          <div className="error-circle">0</div>
          <div className="error-circle">4</div>
        </div>
        <h1>Page Not Found</h1>
        <p className="description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="home-button" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    </div>
  );
}
