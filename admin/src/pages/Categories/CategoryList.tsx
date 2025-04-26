// In src/components/admin/CategoryList.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories, deleteCategory } from '../../services/apiAdmin'; 
import { toast } from 'react-toastify';
import { Category } from '../../types/Category';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
        toast.error(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleEditCategory = (categoryId: number) => {
    navigate(`/admin/categories/edit/${categoryId}`);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm(`Are you sure you want to delete category with ID ${categoryId}?`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteCategory(categoryId);
        toast.success(`Category with ID ${categoryId} deleted successfully.`);
        // Refresh the category list
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || `Failed to delete category with ID ${categoryId}`);
        toast.error(err.message || `Failed to delete category with ID ${categoryId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Category List</h1>
      <Link to="/admin/categories/add" style={{ marginBottom: '10px', display: 'inline-block' }}>
        Add New Category
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEditCategory(category.categoryId)}>Edit</button>
                <button
                  style={{ marginLeft: '5px', backgroundColor: '#f44336', color: 'white' }}
                  onClick={() => handleDeleteCategory(category.categoryId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;