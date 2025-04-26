// In src/components/admin/AddBundleCaste.tsx
import React, { useState } from 'react';
import { addBundleCaste } from '../../services/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { bundleId, casteId } = formData;

    if (!bundleId) {
      toast.error('Bundle ID is required');
      return;
    }
    if (!casteId) {
      toast.error('Caste ID is required');
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
      toast.error(`Failed to add bundle-caste association: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1>Add New Bundle Caste</h1>
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
        <button type="submit">Add Association</button>
        <button type="button" onClick={() => navigate('/admin/bundle-castes')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddBundleCaste;