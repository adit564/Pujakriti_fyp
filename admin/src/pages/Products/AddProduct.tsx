// In AddProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProductImage, createProduct, fetchCategories } from '../../services/apiAdmin'; // Import fetchCategories
import { Product } from '../../types/Product';
import { Category } from '../../types/Category'; // Import the Category type

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
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

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  if (categoriesError) {
    return <div>Error loading categories: {categoriesError}</div>;
  }

  return (
    <div>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price === null ? '' : price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" value={stock === null ? '' : stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} required />
        </div>
        <div>
          <label htmlFor="categoryId">Category:</label>
          <select id="categoryId" value={categoryId || ''} onChange={handleCategoryChange} required>
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image">Product Image:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          {imageFile && <p>Selected Image: {imageFile.name}</p>}
          {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;