import React, { useState, useEffect } from 'react';
import { fetchOrders, fetchPayments, updateOrderStatus } from '../../services/apiAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminOrder, Order } from '../../types/Order';
import { Payment } from '../../types/Payment';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [payments, setPayment] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders();
        setOrders(data);
        const paymentData = await fetchPayments();
        setPayment(paymentData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        toast.error(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const updatedOrder: Order = await updateOrderStatus(orderId, newStatus);
      toast.success(`Order ID ${orderId} status updated to ${newStatus}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.orderId === orderId ? { ...order, status: updatedOrder.status } : order))
      );
    } catch (err: any) {
      toast.error(`Failed to update order ID ${orderId} status: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="order-list">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .order-list {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
          }
          .order-list h1 {
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
          .order-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1000px;
          }
          .order-table th,
          .order-table td {
            padding: 10px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e5e5e5;
          }
          .order-table th {
            background: #f9f9f9;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
          }
          .order-table td {
            color: #666;
          }
          .order-table tr:nth-child(even) {
            background: #fafafa;
          }
          .order-table tr:hover {
            background: #f9f9f9;
          }
          .order-table select {
            padding: 6px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            cursor: pointer;
            outline: none;
          }
          .order-table select:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
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
      <h1>Order List</h1>
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Total Amount</th>
                <th>Address</th>
                <th>Discount Code</th>
                <th>Discount Rate</th>
                <th>Order Date</th>
                <th>Payment Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (

                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.userId}</td>
                  <td>{order.userName}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.address}</td>
                  <td>{order.discountCode || '-'}</td>
                  <td>{order.discountRate !== null ? `${(order.discountRate * 100).toFixed(2)}%` : '-'}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  {payments.map((payment) => 
                    payment.paymentId === order.paymentID ? (
                      <td key={payment.paymentId}>{payment.status}</td>
                    ) : null
                  )}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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

export default OrderList;