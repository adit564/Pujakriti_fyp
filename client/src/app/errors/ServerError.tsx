import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    // <div className="flex flex-col items-center justify-center w-full h-full">
    //   <h1 className="text-4xl font-bold">500</h1>
    //   <p className="mt-4 text-lg">Internal Server Error</p>
    // </div>

    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-graphic">
          <div className="error-circle">5</div>
          <div className="error-circle">0</div>
          <div className="error-circle">0</div>
        </div>
        <h1>Page Not Found</h1>
        <p className="description">
          Something went wrong on our end. We're working to fix it. Please try
          again later.
        </p>
        <button className="home-button" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    </div>
  );
}
