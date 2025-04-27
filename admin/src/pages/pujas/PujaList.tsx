import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPujas } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puja } from '../../types/Puja';

const PujaList: React.FC = () => {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPujas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPujas();
        setPujas(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Pujas');
        toast.error(err.message || 'Failed to fetch Pujas');
      } finally {
        setLoading(false);
      }
    };

    loadPujas();
  }, []);

  const handleEditPuja = (pujaId: number) => {
    navigate(`/admin/pujas/edit/${pujaId}`);
  };

  return (
    <div className="puja-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .puja-list {
            font-family: "Poppins", sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .puja-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .puja-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px;
          }
          .puja-table th,
          .puja-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .puja-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .puja-table td {
            color: #666;
          }
          .puja-table tr:nth-child(even) {
            background: #fafafa;
          }
          .puja-table tr:hover {
            background: #f9f9f9;
          }
          .puja-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #4B0082;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .puja-table button:hover {
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
      <h1>Puja List</h1>
      {loading ? (
        <div className="loading">Loading Pujas...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="puja-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pujas.map((puja) => (
                <tr key={puja.pujaId}>
                  <td>{puja.pujaId}</td>
                  <td>{puja.name}</td>
                  <td>{puja.description}</td>
                  <td>
                    <button onClick={() => handleEditPuja(puja.pujaId)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default PujaList;