import React, { useState, useEffect } from 'react';
import { clearAuthError, loginUser, signupUser } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import "../../app/styles/auth.css";
import { toast } from 'react-toastify';

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user, verificationMessage  } = useAppSelector((state) => state.auth as{
    loading: boolean;
    error: null | { message?: string; detail?: string }; 
    user: any;
    verificationMessage?: string; 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/login'); // Redirect to login after successful signup
      return;
    }
  }, [user, navigate]);


  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error for the changed field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const errors: { name: string; email: string; password: string; phone: string } = {
      name: '',
      email: '',
      password: '',
      phone: '',
    };




    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters and must contain at least one lowercase, uppercase and special character';
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters and must contain at least one lowercase, uppercase and special character';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters and must contain at least one lowercase, uppercase and special character';
      isValid = false;
    } else if (!/[^a-zA-Z0-9\s]/.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters and must contain at least one lowercase, uppercase and special character';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const result = await dispatch(signupUser(formData));
      setIsSubmitting(false);
      if (signupUser.fulfilled.match(result)) {
        toast.success(verificationMessage || 'Signup successful! Please check your email to verify your account.');
        // Optionally navigate to a "check email" page
        // navigate('/check-email'); // You'll need to create this route/component
      }
    }
  };

  if (user) {
    return (
      <div className="signup-container">
        <div className="already-logged-in">
          <h2>You are already signed up and might be logged in!</h2>
          <p>You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join us today!</p>

        {error && typeof error === 'object' && error?.message === "Email address already exists" && (
          <div className="error-message">Email address already exists. Please use a different email.</div>
        )}
        {error && typeof error === 'object' && error?.message && error?.message !== "Email address already exists" && (
          <div className="error-message">{error.message}</div>
        )}
        {error && typeof error === 'string' && (
          <div className="error-message">{error}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            aria-invalid={!!formErrors.name}
            aria-describedby="name-error"
          />
          {formErrors.name && <div className="error-message" id="name-error">{formErrors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            aria-invalid={!!formErrors.email}
            aria-describedby="email-error"
          />
          {formErrors.email && <div className="error-message" id="email-error">{formErrors.email}</div>}
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              aria-invalid={!!formErrors.password}
              aria-describedby="password-error"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="eye-icon" viewBox="0 0 24 24">
                  <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>
                </svg>
              ) : (
                <svg className="eye-icon" viewBox="0 0 24 24">
                  <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z"/>
                </svg>
              )}
            </button>
          </div>
          {formErrors.password && <div className="error-message" id="password-error">{formErrors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+977 9811111111"
            required
            aria-invalid={!!formErrors.phone}
            aria-describedby="phone-error"
          />
          {formErrors.phone && <div className="error-message" id="phone-error">{formErrors.phone}</div>}
        </div>

        <button type="submit" disabled={loading || isSubmitting} className="submit-btn">
          {loading || isSubmitting ? (
            <span className="spinner">Processing...</span>
          ) : (
            'Sign Up'
          )}
        </button>

        <div className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;