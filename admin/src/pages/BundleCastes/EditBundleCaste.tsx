// In src/components/admin/EditBundleCaste.tsx
import React, { useState, useEffect } from 'react';
import { fetchBundleCastes, updateBundleCaste } from '../../services/apiAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    return <div>Loading bundle-caste details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!id) {
    return <div>Invalid bundle-caste ID.</div>;
  }

  return (
    <div>
      <h1>Edit Bundle Caste</h1>
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
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
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate('/admin/bundle-castes')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditBundleCaste;