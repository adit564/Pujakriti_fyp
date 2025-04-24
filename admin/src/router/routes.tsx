import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserList from "../pages/users/UserList";
import ProductList from "../pages/Products/ProductList";
import AddProduct from "../pages/Products/AddProduct";
import EditProduct from "../pages/Products/EditProduct";
import AddBundle from "../pages/Bundles/AddBundle";
import BundleList from "../pages/Bundles/BundleList";
import EditBundle from "../pages/Bundles/EditBundle";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <App />,
        children: [
          { path: "", element: <UserList /> },
          { path: "admin/products", element: <ProductList /> },
          { path: "admin/products/add", element: <AddProduct /> },
          { path: "admin/products/edit/:productId", element: <EditProduct /> },

          { path: "admin/bundles", element: <BundleList /> },
          { path: "admin/bundles/add", element: <AddBundle /> },
          { path: "admin/bundles/edit/:bundleId", element: <EditBundle /> },
        ],
      },


])