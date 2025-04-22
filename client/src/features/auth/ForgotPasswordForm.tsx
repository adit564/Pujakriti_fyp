import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import "../../app/styles/auth.css";
import { forgotPassword, clearAuthError, clearForgotPasswordMessage } from './authSlice'; // Import the forgotPassword action and clear actions

const ForgotPasswordForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error, forgotPasswordMessage } = useAppSelector((state) => state.auth as {
    loading: boolean;
    error: { message?: string; detail?: string } | string | null;
    forgotPasswordMessage: string | null;
  });
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email)); // Dispatch the forgotPassword thunk with the email
  };

  // Clear any existing auth errors when the component mounts/unmounts
  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearForgotPasswordMessage());
    return () => {
      dispatch(clearAuthError());
      dispatch(clearForgotPasswordMessage());
    };
  }, [dispatch]);

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2 className="form-title">Forgot Password</h2>
        <p className="form-subtitle">Enter your email address to reset your password.</p>

        {error && (
          <div className="error-message">
            {typeof error === 'string' ? error : error.message || error.detail || 'An error occurred'}
          </div>
        )}
        {forgotPasswordMessage && <div className="success-message">{forgotPasswordMessage}</div>}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <span className="spinner">Sending...</span> : "Send Reset Link"}
        </button>

        <div className="auth-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;