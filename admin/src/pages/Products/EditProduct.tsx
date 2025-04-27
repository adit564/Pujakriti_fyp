import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
  fetchCategories,
  updateProductImage,
  fetchProductImage,
} from "../../services/apiAdmin";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (productId) {
          const productData = await fetchProductDetails(
            parseInt(productId, 10)
          );
          if (productData) {
            setName(productData.name);
            setDescription(productData.description || "");
            setPrice(productData.price);
            setStock(productData.stock);
            setCategoryId(productData.category || null);
          } else {
            setError(`Product with ID ${productId} not found.`);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
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
          setCurrentImageUrl(
            `/images/client_product_images/${imageData.imageUrl}`
          );
        } else {
          setCurrentImageUrl("/images/client_product_images/default.jpg");
        }
      }
    };

    Promise.all([
      loadProductDetails(),
      loadCategories(),
      loadImageUrl(),
    ]).finally(() => setLoading(false));
  }, [productId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

    const handleCategorychange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
      setCategoryId(value);
    };


  const handleUpdateImage = async () => {
    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }
    if (!selectedImage) {
      toast.warn("Please select an image to update.");
      return;
    }

    try {
      const response = await updateProductImage(
        parseInt(productId, 10),
        selectedImage
      );
      toast.success(response.message || "Product image updated successfully!");
      const imageData = await fetchProductImage(parseInt(productId, 10));
      if (imageData && imageData.imageUrl) {
        setCurrentImageUrl(
          `/images/client_product_images/${imageData.imageUrl}`
        );
      }
      setSelectedImage(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update product image.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdateError(null);

    if (!productId) {
      setUpdateError("Product ID is missing.");
      toast.error("Product ID is missing.");
      return;
    }

    if (!name || price === null || stock === null || categoryId === null) {
      setUpdateError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedProductData: Omit<Product, "productId" | "category"> & {
      categoryId: number | null;
    } = {
      name,
      description,
      price,
      stock,
      categoryId,
    };

    try {
      const updatedProduct = await updateProduct(
        parseInt(productId, 10),
        updatedProductData
      );
      toast.success("Product details updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update product.");
      toast.error(error.message || "Failed to update product details.");
    }
  };

  return (
    <div className="edit-product">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .edit-product {
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
          .edit-product h1 {
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
          .form-group img {
            max-width: 100px;
            max-height: 100px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .submit-button,
          .cancel-button,
          .image-update-button {
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
          .image-update-button {
            background: #4B0082;
            color: #fff;
          }
          .image-update-button:hover {
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
      <h1>Edit Product</h1>
      {loading ? (
        <div className="loading">Loading product details...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
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
                value={price === null ? "" : price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                value={stock === null ? "" : stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Category:</label>
              <select
                id="categoryId"
                value={categoryId || ''}
                onChange={handleCategorychange}
                required
              >
                <option value="">
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="image">Update Image:</label>
              {currentImageUrl && <img src={currentImageUrl} alt={name} />}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <button
                  type="button"
                  className="image-update-button"
                  onClick={handleUpdateImage}
                >
                  Update Image
                </button>
              )}
            </div>
            <div className="form-buttons">
              <button className="submit-button" type="submit">
                Save Changes
              </button>
              <button
                className="cancel-button"
                type="button"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>
            </div>
            {updateError && <p className="error">{updateError}</p>}
          </form>
        </div>
      )}
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

export default EditProduct;
