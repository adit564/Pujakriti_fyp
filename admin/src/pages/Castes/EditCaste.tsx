// In src/components/admin/EditCaste.tsx
import React, { useState, useEffect } from 'react';
import { fetchCasteById, updateCaste } from '../../services/apiAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    return <div>Loading caste details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!casteId) {
    return <div>Invalid caste ID.</div>;
  }

  return (
    <div>
      <h1>Edit Caste</h1>
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
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate('/admin/castes')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCaste;