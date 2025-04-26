// In src/components/admin/EditCategory.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategoryById, updateCategory } from '../../services/apiAdmin'; 
import { toast } from 'react-toastify';
import { Category } from '../../types/Category';

interface Params {
  categoryId: string;
}

interface UpdatedCategory {
  name: string;
  description: string;
}

const EditCategory: React.FC = () => {
  const { categoryId } = useParams<{categoryId:string}>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategoryDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (categoryId) {
          const id = parseInt(categoryId, 10);
          const data = await fetchCategoryById(id);
          setCategory(data);
          setName(data.name);
          setDescription(data.description);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch category details');
        toast.error(err.message || 'Failed to fetch category details');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryDetails();
  }, [categoryId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    const updatedCategory: UpdatedCategory = { name, description };
    try {
      const id = parseInt(categoryId, 10);
      await updateCategory(id, updatedCategory);
      toast.success('Category updated successfully!');
      navigate('/admin/categories'); // Redirect back to the category list
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      toast.error(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading category details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!category) {
    return <div>Category not found.</div>;
  }

  return (
    <div>
      <h1>Edit Category</h1>
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
          {loading ? 'Updating...' : 'Update Category'}
        </button>
      </form>
      <button onClick={() => navigate('/admin/categories')}>Back to List</button>
    </div>
  );
};

export default EditCategory;