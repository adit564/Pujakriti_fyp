import { useNavigate } from "react-router-dom";

export default function BadRequestError() {

    const navigate = useNavigate();
    const handleGoHome= () => {
        navigate('/'); 
    };

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">400 - Bad Request</h1>
            <p className="mt-4">The request could not be understood by the server due to malformed syntax.</p>
        </div>
    );
}