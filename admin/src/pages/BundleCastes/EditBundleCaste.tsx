// In src/components/admin/EditBundleCaste.tsx
import React, { useState, useEffect } from 'react';
import { fetchBundleCastes, updateBundleCaste } from '../../services/apiAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BundleCaste } from '../../types/BundleCaste';

interface EditBundleCasteForm {
  bundleId: number | string;
  casteId: number | string;
}

const EditBundleCaste: React.FC = () => {
  const { id: idParam } = useParams();
  const id = idParam ? parseInt(idParam, 10) : null;
  const [formData, setFormData] = useState<EditBundleCasteForm>({
    bundleId: '',
    casteId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [initialBundleCaste, setInitialBundleCaste] = useState<BundleCaste | null>(null); // To hold initial data

  useEffect(() => {
    const loadBundleCaste = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const allBundleCastes = await fetchBundleCastes();
          const existingBundleCaste = allBundleCastes.find((bc) => bc.id === id);
          if (existingBundleCaste) {
            setFormData({
              bundleId: existingBundleCaste.bundleId.toString(),
              casteId: existingBundleCaste.casteId.toString(),
            });
            setInitialBundleCaste(existingBundleCaste);
          } else {
            setError(`Bundle-caste association with ID ${id} not found`);
            toast.error(`Bundle-caste association with ID ${id} not found`);
          }
        } catch (err: any) {
          setError(err.message || `Failed to load bundle-caste association ID ${id}`);
          toast.error(err.message || `Failed to load bundle-caste association ID ${id}`);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBundleCaste();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !initialBundleCaste) {
      toast.error('Bundle-caste ID is missing or initial data not loaded');
      return;
    }

    const { bundleId, casteId } = formData;

    if (!bundleId) {
      toast.error('Bundle ID is required');
      return;
    }
    if (!casteId) {
      toast.error('Caste ID is required');
      return;
    }

    const updatedBundleCaste: BundleCaste = {
      id: initialBundleCaste.id,
      bundleId: parseInt(bundleId as string, 10),
      casteId: parseInt(casteId as string, 10),
    };

    try {
      await updateBundleCaste(id, updatedBundleCaste);
      toast.success(`Bundle-caste ID ${id} updated successfully`);
      navigate('/admin/bundle-castes');
    } catch (err: any) {
      toast.error(`Failed to update bundle-caste ID ${id}: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading bundle-caste details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!id) {
    return <div className="error">Invalid bundle-caste ID.</div>;
  }

  return (
    <div className="edit-bundle-caste">
      <style>
        {`
          .edit-bundle-caste {
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
          .edit-bundle-caste h1 {
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
          .form-group input[type="number"] {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input[type="number"]:focus {
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
      <h1>Edit Bundle Caste</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bundleId">Bundle ID:</label>
            <input
              type="number"
              id="bundleId"
              name="bundleId"
              value={formData.bundleId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="casteId">Caste ID:</label>
            <input
              type="number"
              id="casteId"
              name="casteId"
              value={formData.casteId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button className="submit-button" type="submit">Save Changes</button>
            <button className="cancel-button" type="button" onClick={() => navigate('/admin/bundle-castes')}>
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

export default EditBundleCaste;