// filepath: f:\GitHub_Uploaded_Projects\Softtrine_Task\Frontend\src\main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Seller from "./Components/Seller.jsx";
import Signup from "./Components/Signup.jsx";
import Login from "./Components/Login.jsx";
import User from "./Components/User.jsx";
import StoreComponent from "./Store.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Seller />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreComponent>
      <RouterProvider router={route} />
    </StoreComponent>
  </StrictMode>
);
