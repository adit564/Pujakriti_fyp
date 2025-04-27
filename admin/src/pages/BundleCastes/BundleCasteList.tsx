// In src/components/admin/BundleCasteList.tsx
import React, { useState, useEffect } from 'react';
import { fetchBundleCastes, deleteBundleCaste } from '../../services/apiAdmin';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BundleCaste } from '../../types/BundleCaste';

const BundleCasteList: React.FC = () => {
  const [bundleCastes, setBundleCastes] = useState<BundleCaste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBundleCastes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBundleCastes();
        setBundleCastes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bundle castes');
        toast.error(err.message || 'Failed to fetch bundle castes');
      } finally {
        setLoading(false);
      }
    };

    loadBundleCastes();
  }, []);

  const handleDeleteBundleCaste = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bundle-caste association?')) {
      try {
        await deleteBundleCaste(id);
        toast.success(`Bundle-caste ID ${id} deleted successfully`);
        setBundleCastes((prevBundleCastes) => prevBundleCastes.filter((bc) => bc.id !== id));
      } catch (err: any) {
        toast.error(`Failed to delete bundle-caste ID ${id}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="bundle-caste-list">
      <style>
        {`
          .bundle-caste-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .bundle-caste-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
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
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .bundle-caste-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px;
          }
          .bundle-caste-table th,
          .bundle-caste-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .bundle-caste-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .bundle-caste-table td {
            color: #666;
          }
          .bundle-caste-table tr:nth-child(even) {
            background: #fafafa;
          }
          .bundle-caste-table tr:hover {
            background: #f9f9f9;
          }
          .bundle-caste-table a {
            color: #007bff;
            text-decoration: none;
            margin-right: 10px;
          }
          .bundle-caste-table a:hover {
            color: #0056b3;
          }
          .bundle-caste-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .bundle-caste-table button:hover {
            background: #c82333;
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
      <h1>Bundle Castes</h1>
      {loading ? (
        <div className="loading">Loading bundle-caste associations...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <Link className="add-link" to="/admin/bundle-castes/add">Add New Bundle Caste</Link>
          <div className="table-container">
            <table className="bundle-caste-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bundle ID</th>
                  <th>Caste ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bundleCastes.map((bc) => (
                  <tr key={bc.id}>
                    <td>{bc.id}</td>
                    <td>{bc.bundleId}</td>
                    <td>{bc.casteId}</td>
                    <td>
                      <Link to={`/admin/bundle-castes/edit/${bc.id}`}>Edit</Link>
                      <button onClick={() => handleDeleteBundleCaste(bc.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default BundleCasteList;