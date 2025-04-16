import React, { useState } from 'react';
import { loginUser  } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import "../../app/styles/auth.css"


const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);
  
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        navigate('/');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 auth_form">
        <h2 className="text-xl font-bold mb-4">Login</h2>
  
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
          className="w-full mb-4 p-2 border rounded"
        />
  
        {error && <p className="text-red-600 mb-2">{error}</p>}
  
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
  };
  
  export default LoginForm;