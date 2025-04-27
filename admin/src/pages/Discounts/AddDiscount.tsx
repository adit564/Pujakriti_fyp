import React, { useState } from 'react';
import { addDiscount } from '../../services/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      navigate('/admin/discounts');
    } catch (err: any) {
      toast.error(`Failed to add discount code: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="add-discount">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .add-discount {
            font-family: 'Arial', sans-serif;
            background: #f4f4f9;
            min-height: 100vh;
            padding: 80px 15px 20px;
            max-width: 80vw;
            margin: 0 auto;
                     display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
          }
          .add-discount h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .form-container {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            width: 30vw;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .form-group input {
            width: 100%;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            background: #fff;
            color: #333;
            outline: none;
          }
          .form-group input:focus {
            border-color: #4B0082;
            box-shadow: 0 0 4px rgba(75, 0, 130, 0.2);
          }
          .form-group input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
          }
          .form-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .submit-button,
          .cancel-button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .submit-button {
            background: #4B0082;
            color: #fff;
          }
          .submit-button:hover {
            background: #DAA520;
          }
          .cancel-button {
            background: #fff;
            color: #4B0082;
            border: 1px solid #4B0082;
          }
          .cancel-button:hover {
            background: #4B0082;
            color: #fff;
          }
        `}
      </style>
      <h1>Add New Discount Code</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
          <div className="form-group">
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
          <div className="form-buttons">
            <button className="submit-button" type="submit">Add Discount</button>
            <button className="cancel-button" type="button" onClick={() => navigate('/admin/discounts')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
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

export default AddDiscount;