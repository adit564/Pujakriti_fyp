import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/catalog";
import HomePage from "../../features/Home/homePage";
import BundleCatalog from "../../features/catalog/bundleCatalog";
import Product from "../../features/catalog/product";


export const router = createBrowserRouter([
    {
        path:'/',
        element: <App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path:'products', element:<Catalog/>},
            {path:'bundles', element:<BundleCatalog/>},
            {path:'product/:productId', element:<Product/>},
            {path:'bundle/:bundleId', element:<Product/>},

        ]
    }
])