// In src/components/admin/EditGuide.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGuideById, updateGuide } from '../../services/apiAdmin'; 
import { toast } from 'react-toastify';
import { Guide } from '../../types/Guide';

interface Params {
  guideId: string;
}

const EditGuide: React.FC = () => {
  const { guideId } = useParams<{guideId:string}>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuideDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (guideId) {
          const id = parseInt(guideId, 10);
          const data = await fetchGuideById(id);
          setGuide(data);
          setName(data.name);
          setDescription(data.description);
          setContent(data.content);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Guide details');
        toast.error(err.message || 'Failed to fetch Guide details');
      } finally {
        setLoading(false);
      }
    };

    loadGuideDetails();
  }, [guideId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideId) return;
    setLoading(true);
    setError(null);
    try {
      const id = parseInt(guideId, 10);
      const updatedGuide = { name, description, content };
      await updateGuide(id, updatedGuide);
      toast.success('Guide updated successfully!');
      navigate('/admin/guides'); // Redirect back to the guide list
    } catch (err: any) {
      setError(err.message || 'Failed to update Guide');
      toast.error(err.message || 'Failed to update Guide');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Guide details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!guide) {
    return <div>Guide not found.</div>;
  }

  return (
    <div>
      <h1>Edit Guide</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" value={content} onChange={handleContentChange} rows={10} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Guide'}
        </button>
      </form>
      <button onClick={() => navigate('/admin/guides')}>Back to List</button>
    </div>
  );
};

export default EditGuide;