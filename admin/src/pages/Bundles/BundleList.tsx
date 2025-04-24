// In src/components/admin/BundleList.tsx
import React, { useState, useEffect, memo } from "react";
import { fetchBundles, deleteBundle, fetchBundleImage, fetchPujas } from "../../services/apiAdmin";
import { Bundle } from "../../types/Bundle";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    return <div>Loading bundles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bundle List</h1>
      <Link to="/admin/bundles/add" style={{ marginBottom: "10px", display: "inline-block" }}>
        Add New Bundle
      </Link>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="searchInput">Search by Name: </label>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter bundle name"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
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
      {/* Removed Guide Filter */}
      <div style={{ marginBottom: "10px" }}>
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Puja</th>
            {/* Removed Guide Header */}
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
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
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
              <td>
                <button onClick={() => handleEditBundle(bundle.bundleId)}>Edit</button>
                <button
                  style={{ marginLeft: "5px", backgroundColor: "#f44336", color: "white" }}
                  onClick={() => handleDeleteBundle(bundle.bundleId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default memo(BundleList);