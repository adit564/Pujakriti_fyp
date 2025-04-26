// In src/components/admin/EditDiscount.tsx
import React, { useState, useEffect } from 'react';
import { fetchDiscount, updateDiscount } from '../../services/apiAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DiscountCode } from '../../types/Discount';

interface EditDiscountForm {
  code: string;
  discountRate: number | string;
  isActive: boolean;
  expiryDate: string;
}

const EditDiscount: React.FC = () => {
  const { discountId: idParam } = useParams();
  const discountId = idParam ? parseInt(idParam, 10) : null;
  const [formData, setFormData] = useState<EditDiscountForm>({
    code: '',
    discountRate: '',
    isActive: false,
    expiryDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDiscount = async () => {
      if (discountId) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchDiscount(discountId);
          setFormData({
            code: data.code,
            discountRate: data.discountRate,
            isActive: data.isActive,
            expiryDate: data.expiryDate,
          });
        } catch (err: any) {
          setError(err.message || `Failed to load discount code ID ${discountId}`);
          toast.error(err.message || `Failed to load discount code ID ${discountId}`);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDiscount();
  }, [discountId]);

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

    if (!discountId) {
      toast.error('Discount ID is missing');
      return;
    }

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

    const updatedDiscount: DiscountCode = {
      discountId,
      code,
      discountRate: rate,
      isActive,
      expiryDate,
    };

    try {
      await updateDiscount(discountId, updatedDiscount);
      toast.success(`Discount code ID ${discountId} updated successfully`);
      navigate('/admin/discounts'); // Redirect to the discount list
    } catch (err: any) {
      toast.error(`Failed to update discount code ID ${discountId}: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div>Loading discount code details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!discountId) {
    return <div>Invalid discount ID.</div>;
  }

  return (
    <div>
      <h1>Edit Discount Code</h1>
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
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate('/admin/discounts')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditDiscount;