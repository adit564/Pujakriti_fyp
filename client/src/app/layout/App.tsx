// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Catalog from '../../features/catalog/catalog.tsx';
import "../styles/app.css";
import Navbar from "./navbar.tsx";
import Footer from "./footer.tsx";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <ToastContainer position="bottom-left" hideProgressBar theme="dark" />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
