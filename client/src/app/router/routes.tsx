import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/catalog";
import HomePage from "../../features/Home/homePage";
import BundleCatalog from "../../features/catalog/bundleCatalog";
import Product from "../../features/catalog/product";
import Bundle from "../../features/catalog/bundle";
import NotFoundError from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import UnauthorizedError from "../errors/UnauthorizedError";
import CartPage from "../../features/cart/cartPage";
import Contact from "../../features/contact/contact";
import About from "../../features/about/about";
import SearchResults from "../../features/searchItem/searchResults";
import LoginForm from "../../features/auth/LoginForm";
import SignupForm from "../../features/auth/SignupForm";
import AddressList from "../../features/address/addressList";
import PaymentVerify from "../../features/payment/paymentVerify";
import PaymentInitiationPage from "../../features/payment/PaymentInitiationPage";
import VerifyEmailPage from "../../features/auth/VerifyEmailPage";
import ForgotPasswordForm from "../../features/auth/ForgotPasswordForm";
import ResetPasswordForm from "../../features/auth/ResetPasswordForm";
import ViewProfile from "../../features/auth/viewProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "products", element: <Catalog /> },
      { path: "bundles", element: <BundleCatalog /> },
      { path: "cart", element: <CartPage /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },

      { path: "product/:productId", element: <Product /> },
      { path: "bundle/:bundleId", element: <Bundle /> },

      { path: "search/", element: <SearchResults /> },

      { path: "view-profile", element: <ViewProfile /> },


      { path: "login", element: <LoginForm /> },
      { path: "signup", element: <SignupForm /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
      { path: "forgot-password", element: <ForgotPasswordForm /> },
      { path: "reset-password", element: <ResetPasswordForm /> },


      

      { path: "addressList", element: <AddressList /> },

      { path: "/payment-verify", element: <PaymentVerify />,      },
      { path: '/payment/initiate/:orderId/:grandTotal', element: <PaymentInitiationPage /> },

      { path: "not-found", element: <NotFoundError /> },
      { path: "server-error", element: <ServerError /> },
      { path: "unauthorized", element: <UnauthorizedError /> },
      { path: "bad-request", element: <NotFoundError /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
