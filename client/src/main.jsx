import React from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import App from "./components/App/App";
import Auth from "./components/Auth/Auth";
import WorldMap from "./components/Map/Map";
import "./index.css";
import { queryClient } from "./util/queryClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/visits",
        element: <App />,
      },
      {
        path: "/map",
        element: <WorldMap />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
