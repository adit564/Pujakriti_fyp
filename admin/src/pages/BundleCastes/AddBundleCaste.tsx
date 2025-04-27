// In src/components/admin/AddBundleCaste.tsx
import React, { useState } from 'react';
import { addBundleCaste } from '../../services/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BundleCaste } from '../../types/BundleCaste';

interface AddBundleCasteForm {
  bundleId: number | string;
  casteId: number | string;
}

const AddBundleCaste: React.FC = () => {
  const [formData, setFormData] = useState<AddBundleCasteForm>({
    bundleId: '',
    casteId: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { bundleId, casteId } = formData;

    if (!bundleId) {
      toast.error('Bundle ID is required');
      setLoading(false);
      return;
    }
    if (!casteId) {
      toast.error('Caste ID is required');
      setLoading(false);
      return;
    }

    const newBundleCaste: Omit<BundleCaste, 'id'> = {
      bundleId: parseInt(bundleId as string, 10),
      casteId: parseInt(casteId as string, 10),
    };

    try {
      await addBundleCaste(newBundleCaste);
      toast.success('Bundle-caste association added successfully');
      navigate('/admin/bundle-castes');
    } catch (err: any) {
      setError(err.message || 'Failed to add bundle-caste association');
      toast.error(`Failed to add bundle-caste association: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bundle-caste">
      <style>
        {`
          .add-bundle-caste {
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
          .add-bundle-caste h1 {
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
      <h1>Add New Bundle Caste</h1>
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
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Association'}
            </button>
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

export default AddBundleCaste;