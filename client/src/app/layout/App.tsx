// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Catalog from '../../features/catalog/catalog.tsx';
import "../styles/app.css";
import HomePage from "../../features/Home/homePage.tsx";
import Navbar from "./navbar.tsx";
import { Route, Routes } from "react-router-dom";
import Catalog from "../../features/catalog/catalog.tsx";
import Footer from "./footer.tsx";
import BundleCatalog from "../../features/catalog/bundleCatalog.tsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/productlist" element={<Catalog />} />
        <Route path="/bundles" element={<BundleCatalog />} />
      </Routes>
      <Footer />

      {/* <Catalog/> */}
    </>
  );
}

export default App;
