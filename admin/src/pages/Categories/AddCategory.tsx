// In src/components/admin/AddCategory.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '../../services/apiAdmin'; 
import { toast } from 'react-toastify';

interface NewCategory {
  name: string;
  description: string;
}

const AddCategory: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const newCategory: NewCategory = { name, description };
    try {
      await addCategory(newCategory);
      toast.success('Category added successfully!');
      navigate('/admin/categories'); // Redirect back to the category list
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
      toast.error(err.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Category</h1>
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
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      <button onClick={() => navigate('/admin/categories')}>Back to List</button>
    </div>
  );
};

export default AddCategory;