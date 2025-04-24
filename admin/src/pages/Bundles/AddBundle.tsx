// In src/components/admin/AddBundle.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBundle, uploadBundleImage } from '../../services/apiAdmin'; // Import upload function
import { toast } from 'react-toastify';

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
    <div>
      <h1>Add New Bundle</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Bundle Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Bundle Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price === null ? '' : price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" value={stock === null ? '' : stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} required />
        </div>
        <hr />
        <h3>Puja Details</h3>
        <div>
          <label htmlFor="pujaName">Puja Name:</label>
          <input type="text" id="pujaName" value={pujaName} onChange={(e) => setPujaName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="pujaDescription">Puja Description:</label>
          <textarea id="pujaDescription" value={pujaDescription} onChange={(e) => setPujaDescription(e.target.value)} />
        </div>
        <hr />
        <h3>Guide Details</h3>
        <div>
          <label htmlFor="guideName">Guide Name:</label>
          <input type="text" id="guideName" value={guideName} onChange={(e) => setGuideName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="guideDescription">Guide Description:</label>
          <textarea id="guideDescription" value={guideDescription} onChange={(e) => setGuideDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="guideContent">Guide Content (Markdown):</label>
          <textarea id="guideContent" value={guideContent} onChange={(e) => setGuideContent(e.target.value)} rows={10} required />
        </div>
        <hr />
        <div>
          <label htmlFor="imageFile">Bundle Image:</label>
          <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} />
          {imageFile && (
            <div>
              <p>Selected Image: {imageFile.name}</p>
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Bundle...' : 'Add Bundle'}
        </button>
        <button type="button" onClick={() => navigate('/admin/bundles')} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddBundle;