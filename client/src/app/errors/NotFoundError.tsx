import { useNavigate } from "react-router-dom";

export default function NotFoundError() {

    const navigate = useNavigate();
    const handleGoHome= () => {
        navigate('/'); 
    };


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page Not Found</p>
    </div>
  );
}