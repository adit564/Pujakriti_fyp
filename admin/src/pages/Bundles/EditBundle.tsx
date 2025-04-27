// In src/components/admin/EditBundle.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBundleById, updateBundleDetails, updateBundleImage, fetchPujas, fetchGuides } from '../../services/apiAdmin'; // Import necessary API functions
import { BundleDetails } from '../../types/Bundle'; // Adjust import path if needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Guide } from '../../types/Guide';
import { Puja } from '../../types/Puja';

interface Params {
  bundleId: string;
}

const EditBundle: React.FC = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<BundleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [pujaId, setPujaId] = useState<number | null>(null);
  const [guideId, setGuideId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const loadBundleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (bundleId) {
          const id = parseInt(bundleId, 10);
          const data = await fetchBundleById(id);
          setBundle(data);
          setName(data.name);
          setDescription(data.description || "");
          setPrice(data.price);
          setStock(data.stock);
          setPujaId(data.puja);
          setGuideId(data.guide);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bundle details');
        toast.error(err.message || 'Failed to fetch bundle details');
      } finally {
        setLoading(false);
      }
    };

    const loadPujasAndGuides = async () => {
      try {
        const pujasList = await fetchPujas();
        setPujas(pujasList);
        const guidesList = await fetchGuides();
        setGuides(guidesList);
      } catch (err: any) {
        console.error("Error fetching Pujas or Guides:", err);
        toast.error(err.message || "Failed to fetch Pujas or Guides.");
      }
    };

    loadBundleDetails();
    loadPujasAndGuides();
  }, [bundleId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPrice(isNaN(value) ? null : value);
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStock(isNaN(value) ? null : value);
  };

  const handlePujaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setPujaId(value);
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setGuideId(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleId) return;
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(bundleId, 10);
      const updatedBundle = {
        name,
        description,
        price,
        stock,
        pujaId,
        guideId,
      };
      await updateBundleDetails(id, updatedBundle);
      toast.success('Bundle details updated successfully!');
      navigate('/admin/bundles'); // Redirect back to the bundle list
    } catch (err: any) {
      setError(err.message || 'Failed to update bundle details');
      toast.error(err.message || 'Failed to update bundle details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleId || !imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(bundleId, 10);
      await updateBundleImage(id, imageFile);
      toast.success('Bundle image updated successfully!');
      // Optionally, refresh bundle details or image preview
    } catch (err: any) {
      setError(err.message || 'Failed to update bundle image');
      toast.error(err.message || 'Failed to update bundle image');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading bundle details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!bundle) {
    return <div className="not-found">Bundle not found.</div>;
  }

  return (
    <div className="edit-bundle">
      <style>
        {`
          .edit-bundle {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .edit-bundle h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
          }
          .form-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            width: 50vw;
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
          .form-group input[type="text"],
          .form-group input[type="number"],
          .form-group textarea,
          .form-group select,
          .form-group input[type="file"] {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
            box-sizing: border-box;
          }
          .form-group textarea {
            resize: vertical;
          }
          .form-group input[type="text"]:focus,
          .form-group input[type="number"]:focus,
          .form-group textarea:focus,
          .form-group select:focus,
          .form-group input[type="file"]:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-section-title {
            font-size: 18px;
            color: #333;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 5px;
          }
          .form-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
          .submit-button,
          .cancel-button {
            padding: 10px 16px;
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
          .submit-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .submit-button:hover:not(:disabled) {
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
          .loading, .error, .not-found {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #666;
          }
          .error {
            color: #B22222;
          }
          .not-found {
            color: orange;
          }
          .image-upload-section {
            margin-top: 30px;
            border-top: 1px solid #e5e5e5;
            padding-top: 20px;
          }
        `}
      </style>
      <h1>Edit Bundle</h1>
      <div className="form-container">
        <form onSubmit={handleSubmitDetails}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" value={description} onChange={handleDescriptionChange} />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" value={price || ''} onChange={handlePriceChange} />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock:</label>
            <input type="number" id="stock" value={stock || ''} onChange={handleStockChange} />
          </div>
          <div className="form-group">
            <label htmlFor="puja">Puja:</label>
            <select id="puja" value={pujaId || ''} onChange={handlePujaChange}>
              <option value="">Select Puja</option>
              {pujas.map((puja) => (
                <option key={puja.pujaId} value={puja.pujaId}>
                  {puja.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="guide">Guide:</label>
            <select id="guide" value={guideId || ''} onChange={handleGuideChange}>
              <option value="">Select Guide</option>
              {guides.map((guide) => (
                <option key={guide.guideId} value={guide.guideId}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Details'}
            </button>
            <button type="button" className="cancel-button" onClick={() => navigate('/admin/bundles')}>
              Back to List
            </button>
          </div>
        </form>
      </div>

      <div className="form-container image-upload-section">
        <h2>Update Image</h2>
        <form onSubmit={handleSubmitImage}>
          <div className="form-group">
            <label htmlFor="image">New Image:</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={loading || !imageFile}>
              {loading ? 'Uploading Image...' : 'Update Image'}
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

export default EditBundle;