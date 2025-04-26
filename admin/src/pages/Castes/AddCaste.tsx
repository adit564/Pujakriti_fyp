// In src/components/admin/AddCaste.tsx
import React, { useState } from 'react';
import { addCaste } from '../../services/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AddCasteForm {
  name: string;
}

const AddCaste: React.FC = () => {
  const [formData, setFormData] = useState<AddCasteForm>({
    name: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name } = formData;

    if (!name) {
      toast.error('Caste name is required');
      return;
    }

    try {
      const newCaste: { name: string } = { name };
      await addCaste(newCaste);
      toast.success('Caste added successfully');
      navigate('/admin/castes');
    } catch (err: any) {
      toast.error(`Failed to add caste: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1>Add New Caste</h1>
      <form onSubmit={handleSubmit}>
        <div>
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
        <button type="submit">Add Caste</button>
        <button type="button" onClick={() => navigate('/admin/castes')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCaste;