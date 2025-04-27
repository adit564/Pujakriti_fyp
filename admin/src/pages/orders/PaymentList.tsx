import React, { useState, useEffect } from 'react';
import { fetchPayments } from '../../services/apiAdmin';
import { Payment } from '../../types/Payment';

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPayments(filterStatus === 'ALL' ? '' : filterStatus);
        setPayments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [filterStatus]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div className="payment-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .payment-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .payment-list h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .filter-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .filter-container label {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
          .filter-container select {
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            cursor: pointer;
            outline: none;
            max-width: 200px;
          }
          .filter-container select:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .table-container {
            overflow-x: auto;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
          }
          .payment-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
          }
          .payment-table th,
          .payment-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .payment-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .payment-table td {
            color: #666;
          }
          .payment-table tr:nth-child(even) {
            background: #fafafa;
          }
          .payment-table tr:hover {
            background: #f9f9f9;
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
      <h1>Payment List</h1>
      {loading ? (
        <div className="loading">Loading payments...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <div className="filter-container">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
              <option value="ALL">All</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
          <div className="table-container">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{payment.orderId}</td>
                    <td>{payment.userId}</td>
                    <td>{payment.transactionId}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.status}</td>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentList;