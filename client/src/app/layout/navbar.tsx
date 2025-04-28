import { NavLink } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import "../styles/navbar.css"

const Navbar = () => {
  const { cart } = useAppSelector((state) => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        event.target !== document.querySelector(".hamburger-react")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.matches(":hover") &&
        !buttonRef.current.matches(":hover")
      ) {
        setIsDropdownOpen(false);
      }
    }, 100);
  };

  const cartItemsCount =
    cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart_id");
    localStorage.removeItem("cart");

    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav_f_container">
        <a href="/" className="logo">
          Pujakriti.
        </a>
        <button
          className="hamburger-react"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          <div className={`bar ${isMobileMenuOpen ? "open" : ""}`} />
          <div className={`bar ${isMobileMenuOpen ? "open" : ""}`} />
          <div className={`bar ${isMobileMenuOpen ? "open" : ""}`} />
        </button>
        <div
          className={`left_menu menu ${isMobileMenuOpen ? "open" : ""}`}
          ref={mobileMenuRef}
        >
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/bundles" onClick={() => setIsMobileMenuOpen(false)}>
            Bundles
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/suggest-bundle" onClick={() => setIsMobileMenuOpen(false)}>
            Suggest Bundle
          </NavLink>
        </div>
      </div>
      <div className="right_menu menu">
        <form className="search_button" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search_svg_btn">
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6.18279"
                cy="5.67107"
                r="4.70454"
                stroke="black"
                strokeWidth="1.93306"
              />
              <path
                d="M9.19922 10.2334L14.5764 16.5884"
                stroke="#131313"
                strokeWidth="1.93306"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>

        <div
          className="acc_button_container"
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink className="acc_button" to={"/login"}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="8.07915"
                cy="5.45122"
                r="4.13735"
                stroke="black"
                strokeWidth="1.70001"
              />
              <path
                d="M1.73242 15.0523C6.77385 11.61 9.56204 11.5505 14.4613 15.0523"
                stroke="#131313"
                strokeWidth="1.70001"
                strokeLinecap="round"
              />
            </svg>
          </NavLink>

          {isDropdownOpen && (
            <div
              className="dropdown_menu"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/view-profile" className="dropdown_item">
                Profile
              </NavLink>
              <NavLink to="/addressList" className="dropdown_item">
                Address
              </NavLink>
              <button onClick={handleLogout} className="dropdown_item">
                Logout
              </button>
            </div>
          )}
        </div>

        <NavLink to="/cart" className="cart_button">
          <svg
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_1716_454" fill="white">
              <path d="M0.113281 6.42144C0.113281 5.90985 0.528011 5.49512 1.03961 5.49512H15.5134C16.025 5.49512 16.4397 5.90985 16.4397 6.42144V13.7162C16.4397 16.0824 14.5216 18.0005 12.1555 18.0005H4.39753C2.0314 18.0005 0.113281 16.0824 0.113281 13.7162V6.42144Z" />
            </mask>
            <path
              d="M0.113281 6.42144C0.113281 5.90985 0.528011 5.49512 1.03961 5.49512H15.5134C16.025 5.49512 16.4397 5.90985 16.4397 6.42144V13.7162C16.4397 16.0824 14.5216 18.0005 12.1555 18.0005H4.39753C2.0314 18.0005 0.113281 16.0824 0.113281 13.7162V6.42144Z"
              stroke="#131313"
              strokeWidth="3.40001"
              mask="url(#path-1-inside-1_1716_454)"
            />
            <path
              d="M5.43954 8.75797V2.98829C5.41407 0.424461 11.083 0.251421 11.1132 2.98829V8.75797"
              stroke="#131313"
              strokeWidth="1.70001"
              strokeLinecap="round"
            />
          </svg>
          <span className="cart_items">{cartItemsCount}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
