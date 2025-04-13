// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Catalog from '../../features/catalog/catalog.tsx';
import "../styles/app.css";
import Navbar from "./navbar.tsx";
import Footer from "./footer.tsx";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscountNotification from "./DiscountNotification.tsx";
import { useAppDispatch } from "../store/configureStore.ts";
import { useEffect } from "react";
import { setCart } from "../../features/cart/cartSlice.ts";

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
          // optionally: fetch from API if not in localStorage
          // const cart = await agent.Cartt.getCartFromApi();
          // dispatch(setCart(cart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
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
