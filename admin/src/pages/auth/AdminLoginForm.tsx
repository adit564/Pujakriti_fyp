import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin, clearAdminAuthError } from '../../services/adminAuthSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

const AdminLoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useAppSelector((state) => state.adminAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminAuthError());
        };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch<any>(loginAdmin(formData)); // Use thunk-compatible dispatch
    };


    return (
        <>
                  <style>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Poppins', sans-serif;
                        background-color: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    .login-container {
                        background-color: #fff;
                        border-radius: 8px;
                        // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        // padding: 2vw;
                        padding:2.5vh 2vw;
                        // width: 20vw;
                    }

                    .login-form {
                        display: flex;
                        flex-direction: column;
                    }

                    .form-title {
                        font-size: 28px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                        text-align: center;
                    }
                    .form-subtitle {
                        color: #666;
                        margin-bottom: 20px;
                        text-align: center;
                        font-size: 16px;
                    }
                    .error-message {
                        background-color: #ffebee;
                        color: #d32f2f;
                        padding: 10px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 0.9em;
                        text-align: center;
                    }
                    .form-group {
                        margin-bottom: 20px;
                    }
                    .form-group label {
                        display: block;
                        font-size: 16px;
                        color: #333;
                        margin-bottom: 8px;
                        font-weight: 500;
                    }
                    .form-group input {
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-sizing: border-box;
                        outline: none;
                    }
                    .form-group input:focus {
                        border-color: #4B0082;
                        box-shadow: 0 0 5px rgba(75, 0, 130, 0.3);
                    }
                    .password-group {
                        position: relative;
                    }
                    .password-input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }
                    .password-input-wrapper input {
                        padding-right: 40px; /* Space for the toggle button */
                    }
                    .toggle-password {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: none;
                        border: none;
                        cursor: pointer;
                        outline: none;
                    }
                    .eye-icon {
                        width: 20px;
                        height: 20px;
                        fill: #888;
                    }
                    .submit-btn {
                        background-color: #4B0082;
                        color: #fff;
                        padding: 12px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 18px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .submit-btn:hover {
                        background-color: #DAA520;
                    }
                    .submit-btn:disabled {
                        background-color: #ccc;
                        cursor: not-allowed;
                    }
                    .spinner {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: 2px solid #fff;
                        border-top: 2px solid transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .form-footer {
                        margin-top: 20px;
                        text-align: center;
                    }
                    .forgot-password-link {
                        font-size: 0.9em;
                        color: #4B0082;
                        text-decoration: none;
                    }
                    .forgot-password-link:hover {
                        text-decoration: underline;
                    }
                `}
            </style>
    
        <div className="login-container">

            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="form-title">Admin Login</h2>
                    <p className="form-subtitle">Login to your admin account</p>

                    {error && (
                        <div className="error-message">
                            {error.message}
                        </div>
                    )}

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
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg className="eye-icon" viewBox="0 0 24 24">
                                        <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z" />
                                    </svg>
                                ) : (
                                    <svg className="eye-icon" viewBox="0 0 24 24">
                                        <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? <span className="spinner">Logging in...</span> : 'Login'}
                    </button>

                    <div className="form-footer">
                        <Link to="/admin/forgot-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default AdminLoginForm;