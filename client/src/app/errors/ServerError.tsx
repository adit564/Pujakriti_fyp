import { useNavigate } from "react-router-dom";

export default function ServerError() {

    const navigate = useNavigate();
    const handleGoHome= () => {
        navigate('/'); 
    };


    return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="mt-4 text-lg">Internal Server Error</p>
    </div>
  );
}
