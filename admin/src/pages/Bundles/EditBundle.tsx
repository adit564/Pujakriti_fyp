// In src/components/admin/EditBundle.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBundleById, updateBundleDetails, updateBundleImage, fetchPujas, fetchGuides } from '../../services/apiAdmin'; // Import necessary API functions
import { Bundle, BundleDetails } from '../../types/Bundle'; // Adjust import path if needed
import { toast } from 'react-toastify';
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
          setDescription(data.description || " ");
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
    return <div>Loading bundle details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bundle) {
    return <div>Bundle not found.</div>;
  }

  return (
    <div>
      <h1>Edit Bundle</h1>
      <form onSubmit={handleSubmitDetails}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price || ''} onChange={handlePriceChange} />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" value={stock || ''} onChange={handleStockChange} />
        </div>
        <div>
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
        <div>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Details'}
        </button>
      </form>

      <h2>Update Image</h2>
      <form onSubmit={handleSubmitImage}>
        <div>
          <label htmlFor="image">New Image:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={loading || !imageFile}>
          {loading ? 'Uploading Image...' : 'Update Image'}
        </button>
      </form>

      <button onClick={() => navigate('/admin/bundles')}>Back to List</button>
    </div>
  );
};

export default EditBundle;