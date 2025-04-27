import React, { useState, useEffect, memo } from "react";
import { fetchProducts, fetchCategories, fetchProductImage, deleteProduct } from "../../services/apiAdmin";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface ProductListResponse {
  content: Product[];
  totalPages: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("productId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [productImages, setProductImages] = useState<{ [productId: number]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: ProductListResponse = await fetchProducts(
          currentPage,
          pageSize,
          debouncedSearchTerm,
          selectedCategory ?? undefined,
          sortField,
          sortOrder
        );
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, pageSize, selectedCategory, debouncedSearchTerm, sortField, sortOrder]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError(err.message || "Failed to fetch categories");
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const loadProductImages = async () => {
      const images: { [productId: number]: string } = {};
      for (const product of products) {
        if (product.productId) {
          const imageData = await fetchProductImage(product.productId);
          if (imageData && imageData.imageUrl) {
            images[product.productId] = `/images/client_product_images/${imageData.imageUrl}`;
          } else {
            images[product.productId] = '/images/client_product_images/default.jpg';
          }
        }
      }
      setProductImages(images);
    };

    if (!loading && products.length > 0) {
      loadProductImages();
    }
  }, [products, loading]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value === "" ? null : parseInt(event.target.value, 10);
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value);
    setCurrentPage(0);
  };

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
    setCurrentPage(0);
  };

  const generateProductImageUrl = (productId: number | undefined): string => {
    if (productId && productImages[productId]) {
      return productImages[productId];
    }
    return '/images/client_product_images/default.jpg';
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm(`Are you sure you want to delete product with ID ${productId}?`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteProduct(productId);
        alert(`Product with ID ${productId} deleted successfully.`);
        setCurrentPage(0);
        const data: ProductListResponse = await fetchProducts(
          currentPage,
          pageSize,
          debouncedSearchTerm,
          selectedCategory ?? undefined,
          sortField,
          sortOrder
        );
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || `Failed to delete product with ID ${productId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <div className="product-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .product-list {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .product-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .filter-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
          }
          .filter-group {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .filter-group label {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
          .filter-group input,
          .filter-group select {
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
            max-width: 200px;
          }
          .filter-group input:focus,
          .filter-group select:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .filter-group input::placeholder {
            color: #999;
          }
          @media (max-width: 480px) {
            .filter-group input,
            .filter-group select {
              max-width: 100%;
            }
          }
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .product-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1000px;
          }
          .product-table th,
          .product-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .product-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .product-table td {
            color: #666;
          }
          .product-table tr:nth-child(even) {
            background: #fafafa;
          }
          .product-table tr:hover {
            background: #f9f9f9;
          }
          .product-table img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
          }
          .product-table button {
            padding: 6px 12px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
            margin-right: 5px;
          }
          .product-table button.edit {
            background: #4B0082;
            color: #fff;
          }
          .product-table button.edit:hover {
            background: #DAA520;
          }
          .product-table button.delete {
            background: #B22222;
            color: #fff;
          }
          .product-table button.delete:hover {
            background: #8B0000;
          }
          .pagination {
            display: flex;
            gap: 5px;
            justify-content: center;
            margin-top: 20px;
          }
          .pagination button {
            padding: 8px 12px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .pagination button:hover {
            background: #f9f9f9;
          }
          .pagination button.active {
            background: #4B0082;
            color: #fff;
            border-color: #4B0082;
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
          .add-link {
            display: inline-block;
            padding: 8px 16px;
            font-size: 14px;
            background: #4B0082;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            margin-bottom: 15px;
            transition: background 0.2s ease;
          }
          .add-link:hover {
            background: #DAA520;
          }

        `}
      </style>
      <h1>Product List</h1>
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <div className="filter-container">
            <div className="filter-group">
              <label htmlFor="searchInput">Search by Name:</label>
              <input
                type="text"
                id="searchInput"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Enter product name"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="categoryFilter">Filter by Category:</label>
              <select
                id="categoryFilter"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sortField">Sort By:</label>
              <select
                id="sortField"
                value={sortField}
                onChange={handleSortFieldChange}
              >
                <option value="productId">ID</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sortOrder">Order:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <Link className="add-link" to="/admin/products/add">Add New Product</Link>

          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>
                      <img
                        src={generateProductImageUrl(product.productId)}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/client_product_images/default.jpg";
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td>
                      <button className="edit" onClick={() => handleEditProduct(product.productId)}>Edit</button>
                      <button className="delete" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index ? "active" : ""}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(ProductList);