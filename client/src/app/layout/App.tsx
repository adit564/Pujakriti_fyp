import "../styles/app.css";
import Navbar from "./navbar.tsx";
import Footer from "./footer.tsx";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscountNotification from "../../features/discount/DiscountNotification.tsx";
import { useAppDispatch } from "../store/configureStore.ts";
import { useEffect } from "react";
import { setCart } from "../../features/cart/cartSlice.ts";
import { loadUserFromStorage } from "../../features/auth/authSlice.ts";

function App() {
  DiscountNotification();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartString = localStorage.getItem("cart");
        if (cartString) {
          const cart = JSON.parse(cartString);
          dispatch(setCart(cart));
        } else {

        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="bottom-left" hideProgressBar theme="light" />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
