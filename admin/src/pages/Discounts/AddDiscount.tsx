// In src/components/admin/AddDiscount.tsx
import React, { useState } from 'react';
import { addDiscount } from '../../services/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DiscountCode } from '../../types/Discount';

interface AddDiscountForm {
  code: string;
  discountRate: number | string;
  isActive: boolean;
  expiryDate: string;
}

const AddDiscount: React.FC = () => {
  const [formData, setFormData] = useState<AddDiscountForm>({
    code: '',
    discountRate: '',
    isActive: true,
    expiryDate: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { code, discountRate, isActive, expiryDate } = formData;

    // Basic validation
    if (!code) {
      toast.error('Discount code is required');
      return;
    }
    const rate = parseFloat(discountRate as string);
    if (isNaN(rate) || rate < 0 || rate > 1) {
      toast.error('Discount rate must be a number between 0 and 1');
      return;
    }
    if (!expiryDate) {
      toast.error('Expiry date is required');
      return;
    }

    const newDiscount: Omit<DiscountCode, 'discountId'> = {
      code,
      discountRate: rate,
      isActive,
      expiryDate,
    };

    try {
      await addDiscount(newDiscount);
      toast.success('Discount code added successfully');
      navigate('/admin/discounts'); // Redirect to the discount list
    } catch (err: any) {
      toast.error(`Failed to add discount code: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1>Add New Discount Code</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="discountRate">Discount Rate (e.g., 0.2 for 20%):</label>
          <input
            type="number"
            id="discountRate"
            name="discountRate"
            value={formData.discountRate}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="1"
            required
          />
        </div>
        <div>
          <label htmlFor="isActive">Active:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Discount</button>
        <button type="button" onClick={() => navigate('/admin/discounts')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddDiscount;