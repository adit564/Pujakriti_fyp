// In src/components/admin/EditPuja.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPujaById, updatePuja } from '../../services/apiAdmin';
import { toast } from 'react-toastify';
import { Puja } from '../../types/Puja';

interface Params {
  pujaId: string;
}

const EditPuja: React.FC = () => {
  const { pujaId } = useParams<{pujaId:string}>();
  const navigate = useNavigate();
  const [puja, setPuja] = useState<Puja | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPujaDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (pujaId) {
          const id = parseInt(pujaId, 10);
          const data = await fetchPujaById(id);
          setPuja(data);
          setName(data.name);
          setDescription(data.description ?? "");
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Puja details');
        toast.error(err.message || 'Failed to fetch Puja details');
      } finally {
        setLoading(false);
      }
    };

    loadPujaDetails();
  }, [pujaId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pujaId) return;
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(pujaId, 10);
      const updatedPuja = { name, description };
      await updatePuja(id, updatedPuja);
      toast.success('Puja updated successfully!');
      navigate('/admin/pujas'); // Redirect back to the puja list
    } catch (err: any) {
      setError(err.message || 'Failed to update Puja');
      toast.error(err.message || 'Failed to update Puja');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Puja details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!puja) {
    return <div>Puja not found.</div>;
  }

  return (
    <div>
      <h1>Edit Puja</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Puja'}
        </button>
      </form>
      <button onClick={() => navigate('/admin/pujas')}>Back to List</button>
    </div>
  );
};

export default EditPuja;