import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordAdmin } from "../../services/adminAuthService";
import { clearForgotPasswordMessage, clearAdminAuthError } from "../../services/adminAuthSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

const AdminForgotPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, forgotPasswordMessage } = useAppSelector(
    (state) => state.adminAuth
  );
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPasswordAdmin(email) as any);
    setEmailSent(true);
  };

  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordMessage());
      dispatch(clearAdminAuthError());
      setEmailSent(false);
    };
  }, [dispatch]);

  return (
    <>
      <style>
        {`
          .forgot-password-container{
          width:100vw;
          height:60vh;
          padding:15vh 0;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          }
          .login_linkk{
          text-decoration:none;
          color:#131313;
          margin-top:2vh;
          }
        `}
      </style>
      <div className="forgot-password-container">
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <h2 className="form-title">Forgot Password</h2>
          <p className="form-subtitle">
            Enter your email address to reset your password.
          </p>
          {error && (
            <div className="error-message">
              {error.message || "An error occurred"}
            </div>
          )}
          {forgotPasswordMessage && (
            <div className="success-message">{forgotPasswordMessage}</div>
          )}
          {!emailSent ? (
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
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <span className="spinner">Sending...</span>
            ) : (
              "Send Reset Link"
            )}
          </button>
          <div className="auth-link">
            <Link className="login_linkk" to="/admin/login">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminForgotPasswordForm;
