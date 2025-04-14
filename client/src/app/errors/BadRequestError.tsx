import { useNavigate } from "react-router-dom";

export default function BadRequestError() {

    const navigate = useNavigate();
    const handleGoHome= () => {
        navigate('/'); 
    };

    return (
        <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-graphic">
            <div className="error-circle">4</div>
            <div className="error-circle">0</div>
            <div className="error-circle">0</div>
          </div>
          <h1>Bad Request</h1>
          <p className="description">
          The server couldn't understand your request. Please try again.
          </p>
          <button className="home-button" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      </div>
    );
}