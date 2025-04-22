import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import "../../app/styles/auth.css";
import { resetPassword, clearAuthError } from './authSlice'; // Import the resetPassword action

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { loading, error, user } = useAppSelector((state) => state.auth as {
    loading: boolean;
    error: { message?: string; detail?: string } | string | null;
    user: any;
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(clearAuthError()); // Clear any previous errors
    if (user) {
      navigate('/'); // Redirect if already logged in (shouldn't happen here)
    }
  }, [dispatch, navigate, user]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMatchError('');
    setResetSuccessMessage('');

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    }

    if (!token) {
      dispatch(clearAuthError());
      dispatch({ type: 'auth/rejected', payload: 'Invalid or missing reset token.' });
      return;
    }

    const result = await dispatch(resetPassword({ token, newPassword: password }));

    if (resetPassword.fulfilled.match(result)) {
      setResetSuccessMessage(result.payload?.message || 'Your password has been reset successfully. You can now log in.');
      // Optionally, you can navigate to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2 className="form-title">Reset Your Password</h2>
        <p className="form-subtitle">Enter your new password.</p>

        {error && (
          <div className="error-message">
            {typeof error === 'string' ? error : error.message || error.detail || 'An error occurred'}
          </div>
        )}
        {resetSuccessMessage && <div className="success-message">{resetSuccessMessage}</div>}
        {passwordMatchError && <div className="error-message">{passwordMatchError}</div>}

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={password}
            onChange={handlePasswordChange}
            placeholder="New password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <span className="spinner">Resetting...</span> : "Reset Password"}
        </button>

        <div className="auth-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;