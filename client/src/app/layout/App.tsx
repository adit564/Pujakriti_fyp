// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Catalog from '../../features/catalog/catalog.tsx';
import "../styles/app.css";
import HomePage from "../../features/Home/homePage.tsx";
import Navbar from "./navbar.tsx";
import { Route, Routes } from "react-router-dom";
import Catalog from "../../features/catalog/catalog.tsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/productlist" element={<Catalog />} />
      </Routes>

      {/* <Catalog/> */}
    </>
  );
}

export default App;
