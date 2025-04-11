// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Catalog from '../../features/catalog/catalog.tsx';
import "../styles/app.css";
import Navbar from "./navbar.tsx";
import Footer from "./footer.tsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />

      {/* <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/productlist" element={<Catalog />} />
        <Route path="/bundles" element={<BundleCatalog />} />
      </Routes> */}

      <Outlet />


      <Footer />

      {/* <Catalog/> */}
    </>
  );
}

export default App;
