import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDiscounts, deleteDiscount } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscountCode } from '../../types/Discount';

const DiscountList: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDiscounts();
        setDiscounts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch discounts');
        toast.error(err.message || 'Failed to fetch discounts');
      } finally {
        setLoading(false);
      }
    };

    loadDiscounts();
  }, []);

  const handleDeleteDiscount = async (discountId: number) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      try {
        await deleteDiscount(discountId);
        toast.success(`Discount code ID ${discountId} deleted successfully`);
        setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.discountId !== discountId));
      } catch (err: any) {
        toast.error(`Failed to delete discount code ID ${discountId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="discount-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .discount-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .discount-list h1 {
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
          .discount-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
          }
          .discount-table th,
          .discount-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .discount-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .discount-table td {
            color: #666;
          }
          .discount-table tr:nth-child(even) {
            background: #fafafa;
          }
          .discount-table tr:hover {
            background: #f9f9f9;
          }
          .discount-table a {
            color: #4B0082;
            text-decoration: none;
            margin-right: 10px;
          }
          .discount-table a:hover {
            color: #DAA520;
          }
          .discount-table button {
            padding: 6px 12px;
            font-size: 14px;
            background: #B22222;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .discount-table button:hover {
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
      <h1>Discount Codes</h1>
      {loading ? (
        <div className="loading">Loading discount codes...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <Link className="add-link" to="/admin/discounts/add">Add New Discount</Link>
          <div className="table-container">
            <table className="discount-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Discount Rate</th>
                  <th>Active</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.discountId}>
                    <td>{discount.discountId}</td>
                    <td>{discount.code}</td>
                    <td>{(discount.discountRate * 100).toFixed(2)}%</td>
                    <td>{discount.isActive ? 'Yes' : 'No'}</td>
                    <td>{new Date(discount.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/discounts/edit/${discount.discountId}`}>Edit</Link>
                      <button onClick={() => handleDeleteDiscount(discount.discountId)}>Delete</button>
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

export default DiscountList;