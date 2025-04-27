import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProductImage, createProduct, fetchCategories } from '../../services/apiAdmin';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        setCategoriesError(error.message || 'Failed to fetch categories.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || price === null || stock === null || categoryId === null) {
      alert('Please fill in all required fields.');
      return;
    }

    const newProductData: Omit<Product, 'productId' | 'category'> & { categoryId: number | null } = {
      name,
      description,
      price,
      stock,
      categoryId,
    };

    try {
      const newProduct = await createProduct(newProductData);
      console.log('Product created:', newProduct);

      if (imageFile) {
        const tempImagePath = await addProductImage(newProduct.productId, imageFile);
        console.log('Image "uploaded" to:', tempImagePath.imageUrl);
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(`Error adding product: ${error.message}`);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(event.target.value, 10);
    setCategoryId(selectedCategoryId);
  };

  return (
    <div className="add-product">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;

          }
          .add-product {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
          }
          .add-product h1 {
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
            width: 30vw;
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
          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input:focus,
          .form-group textarea:focus,
          .form-group select:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-group textarea {
            min-height: 100px;
            resize: vertical;
          }
          .form-group select option:disabled {
            color: #999;
          }
          .form-group input[type="file"] {
            padding: 3px;
          }
          .form-group p {
            font-size: 14px;
            color: #333;
            margin-top: 5px;
          }
          .form-group p.error {
            color: #B22222;
          }
          .submit-button {
            padding: 8px 16px;
            font-size: 14px;
            background: #4B0082;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .submit-button:hover {
            background: #DAA520;
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
      <h1>Add New Product</h1>
      {categoriesLoading ? (
        <div className="loading">Loading categories...</div>
      ) : categoriesError ? (
        <div className="error">Error loading categories: {categoriesError}</div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={price === null ? '' : price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                value={stock === null ? '' : stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Category:</label>
              <select
                id="categoryId"
                value={categoryId || ''}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="image">Product Image:</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageFile && <p>Selected Image: {imageFile.name}</p>}
              {uploadError && <p className="error">{uploadError}</p>}
            </div>
            <div>
              <button className="submit-button" type="submit">Add Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;