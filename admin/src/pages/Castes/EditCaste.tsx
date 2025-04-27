// In src/components/admin/EditCaste.tsx
import React, { useState, useEffect } from 'react';
import { fetchCasteById, updateCaste } from '../../services/apiAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditCasteForm {
  name: string;
}

const EditCaste: React.FC = () => {
  const { casteId: idParam } = useParams();
  const casteId = idParam ? parseInt(idParam, 10) : null;
  const [formData, setFormData] = useState<EditCasteForm>({
    name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCaste = async () => {
      if (casteId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchCasteById(casteId);
          setFormData({ name: data.name });
        } catch (err: any) {
          setError(err.message || `Failed to load caste ID ${casteId}`);
          toast.error(err.message || `Failed to load caste ID ${casteId}`);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCaste();
  }, [casteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!casteId) {
      toast.error('Caste ID is missing');
      return;
    }

    const { name } = formData;

    if (!name) {
      toast.error('Caste name is required');
      return;
    }

    try {
      await updateCaste(casteId, { name });
      toast.success(`Caste ID ${casteId} updated successfully`);
      navigate('/admin/castes');
    } catch (err: any) {
      toast.error(`Failed to update caste ID ${casteId}: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading caste details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!casteId) {
    return <div className="error">Invalid caste ID.</div>;
  }

  return (
    <div className="edit-caste">
      <style>
        {`
          .edit-caste {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .edit-caste h1 {
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
            width: 40vw;
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
          .form-group input[type="text"] {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input[type="text"]:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .submit-button,
          .cancel-button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .submit-button {
            background: #4B0082;
            color: #fff;
          }
          .submit-button:hover {
            background: #DAA520;
          }
          .cancel-button {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .cancel-button:hover {
            background: #4B0082;
            color: #fff;
          }
          .loading,
          .error {
            font-size: 16px;
            text-align: center;
            padding: 20px;
            color: #666;
          }
          .error {
            color: #B22222;
          }
        `}
      </style>
      <h1>Edit Caste</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button className="submit-button" type="submit">Save Changes</button>
            <button className="cancel-button" type="button" onClick={() => navigate('/admin/castes')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
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

export default EditCaste;