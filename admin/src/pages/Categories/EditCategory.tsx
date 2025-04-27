// In src/components/admin/EditCategory.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategoryById, updateCategory } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Category } from '../../types/Category';

interface Params {
  categoryId: string;
}

interface UpdatedCategory {
  name: string;
  description: string;
}

const EditCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
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
    return <div className="loading">Loading category details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!category) {
    return <div className="error">Category not found.</div>;
  }

  return (
    <div className="edit-category">
      <style>
        {`
          .edit-category {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .edit-category h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .form-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            width: 40vw;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .form-group input[type="text"],
          .form-group textarea {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input[type="text"]:focus,
          .form-group textarea:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-group textarea {
            min-height: 100px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .submit-button,
          .cancel-button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .submit-button {
            background: #4B0082;
            color: #fff;
          }
          .submit-button:hover {
            background: #DAA520;
          }
          .cancel-button {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .cancel-button:hover {
            background: #4B0082;
            color: #fff;
          }
          .loading,
          .error {
            font-size: 16px;
            text-align: center;
            padding: 20px;
            color: #666;
          }
          .error {
            color: #B22222;
          }
        `}
      </style>
      <h1>Edit Category</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div className="form-buttons">
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Category'}
            </button>
            <button className="cancel-button" type="button" onClick={() => navigate('/admin/categories')}>
              Back to List
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default EditCategory;