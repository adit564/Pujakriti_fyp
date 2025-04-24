import React, { useState, useEffect, memo } from "react";
import { fetchProducts, fetchCategories, fetchProductImage, deleteProduct } from "../../services/apiAdmin";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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
  const [productImages, setProductImages] = useState<{ [productId: number]: string }>({}); // Store image URLs by productId
  const navigate = useNavigate(); // Initialize useNavigate

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
  }, [
    currentPage,
    pageSize,
    selectedCategory,
    debouncedSearchTerm,
    sortField,
    sortOrder,
  ]);

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
            images[product.productId] = '/images/client_product_images/default.jpg'; // Use default if no image found
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

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId =
      event.target.value === "" ? null : parseInt(event.target.value, 10);
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset page immediately on search input change
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleSortFieldChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortField(event.target.value);
    setCurrentPage(0);
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
        setCurrentPage(0); // Reset to the first page after deletion
        // Refetch products to update the list
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

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

    return (
      <div style={{ marginTop: "20px" }}>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              marginRight: "5px",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: currentPage === pageNumber ? "#f0f0f0" : "white",
            }}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="searchInput">Search by Name: </label>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter product name"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="categoryFilter">Filter by Category: </label>
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
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="sortField">Sort By: </label>
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
        <label htmlFor="sortOrder" style={{ marginLeft: "10px" }}>
          Order:{" "}
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th> {/* New column for actions */}
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
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/client_product_images/default.jpg";
                  }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => handleEditProduct(product.productId)}>Edit</button>
                <button style={{ marginLeft: "5px", backgroundColor: "#f44336", color: "white" }} onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default memo(ProductList);