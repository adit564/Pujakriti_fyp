import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserList from "../pages/users/UserList";
import ProductList from "../pages/Products/ProductList";
import AddProduct from "../pages/Products/AddProduct";
import EditProduct from "../pages/Products/EditProduct";
import AddBundle from "../pages/Bundles/AddBundle";
import BundleList from "../pages/Bundles/BundleList";
import EditBundle from "../pages/Bundles/EditBundle";
import PujaList from "../pages/pujas/PujaList";
import EditPuja from "../pages/pujas/EditPuja";
import GuideList from "../pages/guides/GuideList";
import EditGuide from "../pages/guides/EditGuide";
import CategoryList from "../pages/Categories/CategoryList";
import AddCategory from "../pages/Categories/AddCategory";
import EditCategory from "../pages/Categories/EditCategory";
import OrderList from "../pages/orders/OrderList";
import PaymentList from "../pages/orders/PaymentList";
import EditDiscount from "../pages/Discounts/EditDiscount";
import AddDiscount from "../pages/Discounts/AddDiscount";
import DiscountList from "../pages/Discounts/DiscountList";
import ReviewList from "../pages/reviews/ReviewList";
import EditBundleCaste from "../pages/BundleCastes/EditBundleCaste";
import AddBundleCaste from "../pages/BundleCastes/AddBundleCaste";
import BundleCasteList from "../pages/BundleCastes/BundleCasteList";
import EditCaste from "../pages/Castes/EditCaste";
import AddCaste from "../pages/Castes/AddCaste";
import CasteList from "../pages/Castes/CastesList";
import AdminDashboard from "../pages/dashboard/Dashboard";
import AdminForgotPasswordForm from "../pages/auth/AdminForgotPasswordForm";
import AdminLoginForm from "../pages/auth/AdminLoginForm";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = [
  { path: "/admin/login", element: <AdminLoginForm /> },
  { path: "/admin/forgot-password", element: <AdminForgotPasswordForm /> },
  { path: "/admin/unauthorized", element: <AdminForgotPasswordForm /> },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />, //  protect this entire section
    children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/users", element: <UserList /> },
      { path: "/admin/products", element: <ProductList /> },
      { path: "/admin/products/add", element: <AddProduct /> },
      { path: "/admin/products/edit/:productId", element: <EditProduct /> },
      { path: "/admin/bundles", element: <BundleList /> },
      { path: "/admin/bundles/add", element: <AddBundle /> },
      { path: "/admin/bundles/edit/:bundleId", element: <EditBundle /> },
      { path: "/admin/pujas", element: <PujaList /> },
      { path: "/admin/pujas/edit/:pujaId", element: <EditPuja /> },
      { path: "/admin/guides", element: <GuideList /> },
      { path: "/admin/guides/edit/:guideId", element: <EditGuide /> },
      { path: "/admin/categories", element: <CategoryList /> },
      { path: "/admin/categories/add", element: <AddCategory /> },
      { path: "/admin/categories/edit/:categoryId", element: <EditCategory /> },
      { path: "/admin/orders", element: <OrderList /> },
      { path: "/admin/payments", element: <PaymentList /> },
      { path: "/admin/discounts", element: <DiscountList /> },
      { path: "/admin/discounts/add", element: <AddDiscount /> },
      { path: "/admin/discounts/edit/:discountId", element: <EditDiscount /> },
      { path: "/admin/bundle-castes", element: <BundleCasteList /> },
      { path: "/admin/bundle-castes/add", element: <AddBundleCaste /> },
      { path: "/admin/bundle-castes/edit/:id", element: <EditBundleCaste /> },
      { path: "/admin/castes", element: <CasteList /> },
      { path: "/admin/castes/add", element: <AddCaste /> },
      { path: "/admin/castes/edit/:casteId", element: <EditCaste /> },
      { path: "/admin/reviews", element: <ReviewList /> },
    ],
  },
];

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: routes,
    },
  ]);
