import { useNavigate } from "react-router-dom";

export default function UnAuthorizedError() {

    const navigate = useNavigate();
    const handleGoHome= () => {
        navigate('/'); 
    };

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">401 - Unauthorized</h1>
            <p className="mt-4">You are not authorized to access this resource.</p>
        </div>
    );

}