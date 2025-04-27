// In src/components/admin/BundleList.tsx
import React, { useState, useEffect, memo } from "react";
import { fetchBundles, deleteBundle, fetchBundleImage, fetchPujas } from "../../services/apiAdmin";
import { Bundle } from "../../types/Bundle";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puja } from "../../types/Puja";

interface BundleListResponse {
  content: Bundle[];
  totalPages: number;
}

const BundleList: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("bundleId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedPuja, setSelectedPuja] = useState<number | null>(null);
  const [bundleImages, setBundleImages] = useState<{ [bundleId: number]: string }>({});
  const [pujas, setPujas] = useState<Puja[]>([]); // State to store pujas
  const navigate = useNavigate();

  useEffect(() => {
    const loadBundles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: BundleListResponse = await fetchBundles(
          currentPage,
          pageSize,
          debouncedSearchTerm,
          selectedPuja ?? undefined,
          undefined, // Removed selectedGuide
          sortField,
          sortOrder
        );
        setBundles(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bundles");
        toast.error(err.message || "Failed to fetch bundles");
      } finally {
        setLoading(false);
      }
    };

    loadBundles();
  }, [currentPage, pageSize, debouncedSearchTerm, sortField, sortOrder, selectedPuja]); // Removed selectedGuide from dependency array

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const loadBundleImages = async () => {
      const images: { [bundleId: number]: string } = {};
      for (const bundle of bundles) {
        try {
          const imageData = await fetchBundleImage(bundle.bundleId);
          if (imageData && imageData.imageUrl) {
            images[bundle.bundleId] = `/images/client_bundle_images/${imageData.imageUrl}`;
          } else {
            images[bundle.bundleId] = '/images/client_bundle_images/default.jpg';
          }
        } catch (error) {
          console.error(`Error fetching image for bundle ${bundle.bundleId}:`, error);
          images[bundle.bundleId] = '/images/client_bundle_images/default.jpg';
        }
      }
      setBundleImages(images);
    };

    if (!loading && bundles.length > 0) {
      loadBundleImages();
    }
  }, [bundles, loading]);

  useEffect(() => {
    const fetchPujasList = async () => {
      try {
        const data = await fetchPujas();
        setPujas(data);
      } catch (error: any) {
        console.error("Failed to fetch Pujas:", error);
        toast.error(error.message || "Failed to fetch Pujas.");
      }
    };

    fetchPujasList();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleSortFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value);
    setCurrentPage(0);
  };

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
    setCurrentPage(0);
  };

  const handlePujaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pujaId = event.target.value === "" ? null : parseInt(event.target.value, 10);
    setSelectedPuja(pujaId);
    setCurrentPage(0);
  };

  const generateBundleImageUrl = (bundleId: number | undefined): string => {
    if (bundleId && bundleImages[bundleId]) {
      return bundleImages[bundleId];
    }
    return '/images/client_bundle_images/default.jpg';
  };

  const handleDeleteBundle = async (bundleId: number) => {
    if (window.confirm(`Are you sure you want to delete bundle with ID ${bundleId}?`)) {
      setLoading(true);
      setError(null);
      try {
        await deleteBundle(bundleId);
        toast.success(`Bundle with ID ${bundleId} deleted successfully.`);
        setCurrentPage(0);
        const data: BundleListResponse = await fetchBundles(
          currentPage,
          pageSize,
          debouncedSearchTerm,
          selectedPuja ?? undefined,
          undefined, // Removed selectedGuide
          sortField,
          sortOrder,
        );
        setBundles(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || `Failed to delete bundle with ID ${bundleId}`);
        toast.error(err.message || `Failed to delete bundle with ID ${bundleId}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditBundle = (bundleId: number) => {
    navigate(`/admin/bundles/edit/${bundleId}`);
  };

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

    return (
      <div className="pagination">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active" : ""}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bundle-list">
      <style>
        {`
          .bundle-list {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background-color: #f4f4f9;
            min-height: 100vh;
          }
          .bundle-list h1 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
          }
          .add-new-link {
            display: inline-block;
            margin-bottom: 20px;
            padding: 10px 15px;
            background-color: #4B0082;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .add-new-link:hover {
            background-color: #DAA520;
          }
          .search-filter-sort {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            align-items: center;
            flex-wrap: wrap;
          }
          .search-filter-sort label {
            font-weight: bold;
            color: #555;
          }
          .search-filter-sort input[type="text"],
          .search-filter-sort select {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }
          .bundle-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            overflow: hidden;
          }
          .bundle-table th, .bundle-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          .bundle-table th {
            background-color: #f8f8f8;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .bundle-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .bundle-table tbody tr:hover {
            background-color: #f5f5f5;
          }
          .bundle-table td img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
            vertical-align: middle;
            margin-right: 10px;
          }
          .bundle-table .actions button {
            padding: 8px 12px;
            margin-right: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
          }
          .bundle-table .actions button:first-child {
            background-color: #007bff;
            color: white;
          }
          .bundle-table .actions button:first-child:hover {
            background-color: #0056b3;
          }
          .bundle-table .actions button:last-child {
            background-color: #dc3545;
            color: white;
          }
          .bundle-table .actions button:last-child:hover {
            background-color: #c82333;
          }
          .pagination {
            margin-top: 20px;
            display: flex;
            justify-content: center;
          }
          .pagination button {
            padding: 8px 12px;
            margin: 0 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            background-color: white;
            color: #333;
            font-size: 14px;
          }
          .pagination button.active {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .pagination button:hover {
            background-color: #eee;
          }
          .loading {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #555;
          }
          .error {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #dc3545;
          }
        `}
      </style>
      <h1>Bundle List</h1>
      <Link to="/admin/bundles/add" className="add-new-link">
        Add New Bundle
      </Link>
      <div className="search-filter-sort">
        <div>
          <label htmlFor="searchInput">Search by Name: </label>
          <input
            type="text"
            id="searchInput"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter bundle name"
          />
        </div>
        <div>
          <label htmlFor="pujaFilter">Filter by Puja: </label>
          <select id="pujaFilter" value={selectedPuja || ""} onChange={handlePujaChange}>
            <option value="">All Pujas</option>
            {pujas.map((puja) => (
              <option key={puja.pujaId} value={puja.pujaId}>
                {puja.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortField">Sort By: </label>
          <select
            id="sortField"
            value={sortField}
            onChange={handleSortFieldChange}
          >
            <option value="bundleId">ID</option>
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
      </div>
      {loading ? (
        <div className="loading">Loading bundles...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <table className="bundle-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Puja</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle) => (
                <tr key={bundle.bundleId}>
                  <td>{bundle.bundleId}</td>
                  <td>
                    <img
                      src={generateBundleImageUrl(bundle.bundleId)}
                      alt={bundle.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/client_bundle_images/default.jpg";
                      }}
                    />
                  </td>
                  <td>{bundle.name}</td>
                  <td>{bundle.description}</td>
                  <td>{bundle.price}</td>
                  <td>{bundle.stock}</td>
                  <td>{bundle.puja}</td>
                  <td className="actions">
                    <button onClick={() => handleEditBundle(bundle.bundleId)}>Edit</button>
                    <button onClick={() => handleDeleteBundle(bundle.bundleId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && renderPagination()}
        </>
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

export default memo(BundleList);