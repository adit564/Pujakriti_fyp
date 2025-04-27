import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store'; // Corrected path
import { logoutAdmin } from '../services/adminAuthSlice'; // Corrected path
import "../styles/navbar.css"

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        dispatch(logoutAdmin());
        setIsMobileMenuOpen(false); 
        navigate('/admin/login'); 
    };

    const navLinks = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/products', label: 'Products' },
        { path: '/admin/bundles', label: 'Bundles' },
        { path: '/admin/pujas', label: 'Pujas' },
        { path: '/admin/guides', label: 'Guides' },
        { path: '/admin/categories', label: 'Categories' },
        { path: '/admin/orders', label: 'Orders' },
        { path: '/admin/payments', label: 'Payments' },
        { path: '/admin/discounts', label: 'Discounts' },
        { path: '/admin/bundle-castes', label: 'Bundle Castes' },
        { path: '/admin/castes', label: 'Castes' },
        { path: '/admin/reviews', label: 'Reviews' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/admin/dashboard" className="navbar-logo">
                    Pujakriti
                </Link>
                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={location.pathname === link.path ? 'active' : ''}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="nav-logout-button">Logout</button>
                </div>
                <div
                    className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={location.pathname === link.path ? 'active' : ''}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                <button onClick={handleLogout} className="mobile-nav-logout-button">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;