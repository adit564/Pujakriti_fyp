// In src/components/admin/PaymentList.tsx
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

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment List</h1>
      <div>
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>
      <table>
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
  );
};

export default PaymentList;