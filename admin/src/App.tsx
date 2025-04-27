// App.tsx
import { useEffect } from 'react';
import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch } from './store/store';
import { loadAdminFromStorage } from './services/adminAuthSlice';
import Navbar from './components/Navbar';
import { routes } from './router/routes';

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
    const dispatch = useAppDispatch();
    const modifiedRouter = createBrowserRouter([
      {
        path: "/",
        element: <AppLayout />,
        children: routes, // Your existing routes
      },
    ]);

    useEffect(() => {
        dispatch(loadAdminFromStorage());
    }, [dispatch]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <RouterProvider router={modifiedRouter} />
        </>
    );
}

export default App;