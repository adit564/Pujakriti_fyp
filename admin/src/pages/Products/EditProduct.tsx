// In EditProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct, fetchCategories, updateProductImage, fetchProductImage } from '../../services/apiAdmin';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { toast } from 'react-toastify'; // Import toast

interface RouteParams {
  productId: string;
}

const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (productId) {
          const productData = await fetchProductDetails(parseInt(productId, 10));
          if (productData) {
            setName(productData.name);
            setDescription(productData.description || '');
            setPrice(productData.price);
            setStock(productData.stock);
            setCategoryId(productData.category || null);
          } else {
            setError(`Product with ID ${productId} not found.`);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError(err.message || "Failed to fetch categories");
      }
    };

    const loadImageUrl = async () => {
      if (productId) {
        const imageData = await fetchProductImage(parseInt(productId, 10));
        if (imageData && imageData.imageUrl) {
          setCurrentImageUrl(`/images/client_product_images/${imageData.imageUrl}`);
        } else {
          setCurrentImageUrl('/images/client_product_images/default.jpg');
        }
      }
    };

    loadProductDetails();
    loadCategories();
    loadImageUrl();
  }, [productId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleUpdateImage = async () => {
    if (!productId) {
      toast.error('Product ID is missing.');
      return;
    }
    if (!selectedImage) {
      toast.warn('Please select an image to update.');
      return;
    }

    try {
      const response = await updateProductImage(parseInt(productId, 10), selectedImage);
      toast.success(response.message || 'Product image updated successfully!');
      // Optionally, reload the image URL to display the new image
      const imageData = await fetchProductImage(parseInt(productId, 10));
      if (imageData && imageData.imageUrl) {
        setCurrentImageUrl(`/images/client_product_images/${imageData.imageUrl}`);
      }
      setSelectedImage(null); // Clear the selected image
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product image.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!productId) {
      console.error("Product ID is missing for update.");
      setUpdateError("Product ID is missing.");
      return;
    }

    if (!name || price === null || stock === null || categoryId === null) {
      setUpdateError('Please fill in all required fields.');
      return;
    }

    const updatedProductData: Omit<Product, 'productId' | 'category'> & { categoryId: number | null } = {
      name,
      description,
      price,
      stock,
      categoryId,
    };

    try {
      const updatedProduct = await updateProduct(parseInt(productId, 10), updatedProductData);
      console.log('Product updated:', updatedProduct);
      setUpdateSuccess(true);
      toast.success('Product details updated successfully!');
      setTimeout(() => navigate('/admin/products'), 1500); // Redirect after a short delay
    } catch (error: any) {
      console.error('Error updating product:', error);
      setUpdateError(error.message || 'Failed to update product.');
      toast.error(error.message || 'Failed to update product details.');
    }
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!name) {
    return <div>Loading product form...</div>; // Or some other appropriate loading state for the form
  }

  return (
    <div>
      <h1>Edit Product</h1>
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
          <select
            id="categoryId"
            value={categoryId === null ? '' : categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
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
        <div>
          <label htmlFor="image">Update Image:</label>
          {currentImageUrl && (
            <div>
              <img src={currentImageUrl} alt={name} style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', marginBottom: '10px' }} />
            </div>
          )}
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          {selectedImage && (
            <button type="button" onClick={handleUpdateImage} style={{ marginTop: '10px' }}>Update Image</button>
          )}
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate('/admin/products')} style={{ marginLeft: '10px' }}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProduct;