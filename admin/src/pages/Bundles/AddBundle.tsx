// In src/components/admin/AddBundle.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBundle, uploadBundleImage } from '../../services/apiAdmin'; // Import upload function
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBundle: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [pujaName, setPujaName] = useState('');
  const [pujaDescription, setPujaDescription] = useState('');
  const [guideName, setGuideName] = useState('');
  const [guideDescription, setGuideDescription] = useState('');
  const [guideContent, setGuideContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // State for image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || price === null || stock === null || !pujaName || !guideName || !guideContent) {
      setError('Please fill in all required fields.');
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const newBundleData = {
      name,
      description,
      price,
      stock,
      puja: {
        name: pujaName,
        description: pujaDescription,
      },
      guide: {
        name: guideName,
        description: guideDescription,
        content: guideContent,
      },
    };

    try {
      const addedBundle = await addBundle(newBundleData);
      toast.success(`Bundle "${addedBundle.name}" added successfully!`);

      if (imageFile) {
        try {
          await uploadBundleImage(addedBundle.bundleId, imageFile);
          toast.success('Bundle image uploaded successfully!');
        } catch (imageUploadError: any) {
          toast.error(imageUploadError.message || 'Failed to upload bundle image.');
          // Optionally, decide if a failure to upload the image should still redirect.
        }
      }

      navigate('/admin/bundles'); // Redirect to the bundle list page
    } catch (err: any) {
      setError(err.message || 'Failed to add new bundle.');
      toast.error(err.message || 'Failed to add new bundle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bundle">
      <style>
        {`
          .add-bundle {
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
          .add-bundle h1 {
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
          .selected-image-info {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
          }
          .error-message {
            color: red;
            margin-bottom: 10px;
          }
        `}
      </style>
      <h1>Add New Bundle</h1>
      <div className="form-container">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Bundle Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Bundle Description:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" value={price === null ? '' : price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock:</label>
            <input type="number" id="stock" value={stock === null ? '' : stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} required />
          </div>

          <div className="form-section-title">Puja Details</div>
          <div className="form-group">
            <label htmlFor="pujaName">Puja Name:</label>
            <input type="text" id="pujaName" value={pujaName} onChange={(e) => setPujaName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="pujaDescription">Puja Description:</label>
            <textarea id="pujaDescription" value={pujaDescription} onChange={(e) => setPujaDescription(e.target.value)} />
          </div>

          <div className="form-section-title">Guide Details</div>
          <div className="form-group">
            <label htmlFor="guideName">Guide Name:</label>
            <input type="text" id="guideName" value={guideName} onChange={(e) => setGuideName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="guideDescription">Guide Description:</label>
            <textarea id="guideDescription" value={guideDescription} onChange={(e) => setGuideDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="guideContent">Guide Content (Markdown):</label>
            <textarea id="guideContent" value={guideContent} onChange={(e) => setGuideContent(e.target.value)} rows={10} required />
          </div>

          <div className="form-section-title">Bundle Image</div>
          <div className="form-group">
            <label htmlFor="imageFile">Upload Image:</label>
            <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} />
            {imageFile && (
              <div className="selected-image-info">
                Selected Image: {imageFile.name}
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding Bundle...' : 'Add Bundle'}
            </button>
            <button type="button" className="cancel-button" onClick={() => navigate('/admin/bundles')}>
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

export default AddBundle;