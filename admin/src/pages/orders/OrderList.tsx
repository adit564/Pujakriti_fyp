// In src/components/admin/OrderList.tsx
import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/apiAdmin';
import { toast } from 'react-toastify';
import { AdminOrder, Order } from '../../types/Order';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders();
        setOrders(data);
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

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Order List</h1>
      <table>
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
  );
};

export default OrderList;