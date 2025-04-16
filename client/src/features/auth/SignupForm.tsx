import React, { useState } from 'react';
import { signupUser } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import "../../app/styles/auth.css"

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',  
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData)); 
    if (signupUser.fulfilled.match(result)) {
      navigate('/login'); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 auth_form">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <input
        type="text"
        name="name"  // Change name here too
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full mb-4 p-2 border rounded"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
