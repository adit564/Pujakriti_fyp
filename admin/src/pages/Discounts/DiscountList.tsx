// In src/components/admin/DiscountList.tsx
import React, { useState, useEffect } from 'react';
import { fetchDiscounts, deleteDiscount } from '../../services/apiAdmin';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
        // Update the discount list after deletion
        setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.discountId !== discountId));
      } catch (err: any) {
        toast.error(`Failed to delete discount code ID ${discountId}: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading discount codes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Discount Codes</h1>
      <Link to="/admin/discounts/add">Add New Discount</Link>
      <table>
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
  );
};

export default DiscountList;