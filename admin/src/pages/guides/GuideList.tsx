import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGuides } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Guide } from '../../types/Guide';

const GuideList: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGuides();
        setGuides(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Guides');
        toast.error(err.message || 'Failed to fetch Guides');
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const handleEditGuide = (guideId: number) => {
    navigate(`/admin/guides/edit/${guideId}`);
  };

  return (
    <div className="guide-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .guide-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .guide-list h1 {
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
          .guide-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
          }
          .guide-table th,
          .guide-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .guide-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .guide-table td {
            color: #666;
          }
          .guide-table tr:nth-child(even) {
            background: #fafafa;
          }
          .guide-table tr:hover {
            background: #f9f9f9;
          }
          .guide-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #4B0082;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .guide-table button:hover {
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
      <h1>Guide List</h1>
      {loading ? (
        <div className="loading">Loading Guides...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="guide-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide.guideId}>
                  <td>{guide.guideId}</td>
                  <td>{guide.name}</td>
                  <td>{guide.description}</td>
                  <td>{guide.content}</td>
                  <td>
                    <button onClick={() => handleEditGuide(guide.guideId)}>Edit</button>
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

export default GuideList;