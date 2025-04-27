// In src/components/admin/CasteList.tsx
import React, { useState, useEffect } from 'react';
import { fetchCastes, deleteCaste } from '../../services/apiAdmin';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Caste } from '../../types/Caste';

const CasteList: React.FC = () => {
  const [castes, setCastes] = useState<Caste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCastes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCastes();
        setCastes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch castes');
        toast.error(err.message || 'Failed to fetch castes');
      } finally {
        setLoading(false);
      }
    };

    loadCastes();
  }, []);

  const handleDeleteCaste = async (casteId: number) => {
    if (window.confirm('Are you sure you want to delete this caste?')) {
      try {
        await deleteCaste(casteId);
        toast.success(`Caste ID ${casteId} deleted successfully`);
        setCastes((prevCastes) => prevCastes.filter((caste) => caste.casteId !== casteId));
      } catch (err: any) {
        toast.error(`Failed to delete caste ID ${casteId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="caste-list">
      <style>
        {`
          .caste-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .caste-list h1 {
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
          .caste-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 400px;
          }
          .caste-table th,
          .caste-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .caste-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .caste-table td {
            color: #666;
          }
          .caste-table tr:nth-child(even) {
            background: #fafafa;
          }
          .caste-table tr:hover {
            background: #f9f9f9;
          }
          .caste-table a {
            color: #4B0082;
            text-decoration: none;
            margin-right: 10px;
          }
          .caste-table a:hover {
            color: #DAA520;
          }
          .caste-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #B22222;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .caste-table button:hover {
            background: #8B0000;
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
      <h1>Castes</h1>
      {loading ? (
        <div className="loading">Loading castes...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <Link className="add-link" to="/admin/castes/add">Add New Caste</Link>
          <div className="table-container">
            <table className="caste-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {castes.map((caste) => (
                  <tr key={caste.casteId}>
                    <td>{caste.casteId}</td>
                    <td>{caste.name}</td>
                    <td>
                      <Link to={`/admin/castes/edit/${caste.casteId}`}>Edit</Link>
                      <button onClick={() => handleDeleteCaste(caste.casteId)}>Delete</button>
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

export default CasteList;