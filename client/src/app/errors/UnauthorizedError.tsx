import { useNavigate } from "react-router-dom";

export default function UnAuthorizedError() {

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
            <div className="error-circle">1</div>
          </div>
          <h1>Bad Request</h1>
          <p className="description">
          You are not authorized to access the content.
          </p>
          <button className="home-button" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      </div>

    );

}