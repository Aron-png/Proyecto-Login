import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.tsx"
import Signup from "./routes/signup.tsx"
import Dashboard from "./routes/dashboard.tsx"
import ProtectedRoute from "./routes/ProtectedRoute.tsx"
import Home from "./routes/Home.tsx"
import { AuthProvider } from './auth/AuthProvider.tsx';

const router = createBrowserRouter([
  {
    path:"/",
    element: <Home/>,
    errorElement: <>Error</>
  },
  {
    path:"/login",
    element: <Login/>,
    errorElement: <>Error</>
  },
  {
    path:"/signup",
    element: <Signup/>,
    errorElement: <>Error</>
  },
  {
    /*
    Cada vez que se intente entrar al dashboard, primero entra a "Protected"
    para ver si necesita algo de ahí para renderizarlo.
    */
    path:"/",
    element: <ProtectedRoute/>,
    errorElement: <>Error</>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
