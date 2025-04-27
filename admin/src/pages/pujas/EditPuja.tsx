import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPujaById, updatePuja } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puja } from '../../types/Puja';

const EditPuja: React.FC = () => {
  const { pujaId } = useParams<{ pujaId: string }>();
  const navigate = useNavigate();
  const [puja, setPuja] = useState<Puja | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPujaDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (pujaId) {
          const id = parseInt(pujaId, 10);
          const data = await fetchPujaById(id);
          setPuja(data);
          setName(data.name);
          setDescription(data.description ?? '');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Puja details');
        toast.error(err.message || 'Failed to fetch Puja details');
      } finally {
        setLoading(false);
      }
    };

    loadPujaDetails();
  }, [pujaId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pujaId) return;
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(pujaId, 10);
      const updatedPuja = { name, description };
      await updatePuja(id, updatedPuja);
      toast.success('Puja updated successfully!');
      navigate('/admin/pujas');
    } catch (err: any) {
      setError(err.message || 'Failed to update Puja');
      toast.error(err.message || 'Failed to update Puja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-puja">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .edit-puja {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .edit-puja h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .form-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            max-width: 600px;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input:focus,
          .form-group textarea:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-group textarea {
            min-height: 100px;
            resize: vertical;
          }
          .submit-button,
          .back-button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
            margin-right: 10px;
          }
          .submit-button {
            background: #4B0082;
            color: #fff;
          }
          .submit-button:hover:not(:disabled) {
            background: #DAA520;
          }
          .submit-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .back-button {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .back-button:hover {
            background: #4B0082;
            color: #fff;
          }
          .loading,
          .error,
          .not-found {
            font-size: 16px;
            text-align: center;
            padding: 20px;
            color: #666;
          }
          .error,
          .not-found {
            color: #B22222;
          }
        `}
      </style>
      <h1>Edit Puja</h1>
      {loading ? (
        <div className="loading">Loading Puja details...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : !puja ? (
        <div className="not-found">Puja not found.</div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div>
              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Puja'}
              </button>
              <button
                className="back-button"
                type="button"
                onClick={() => navigate('/admin/pujas')}
              >
                Back to List
              </button>
            </div>
          </form>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default EditPuja;