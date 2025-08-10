import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './App.jsx';
import ProductsList from './ProductsList.jsx';
import ProductDetails from './ProductDetails.jsx';
import Cart from './Cart.jsx';
import SignUp from './SignUp.jsx';
import Login from './Login.jsx';
import Checkout from './Checkout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404  Not Found</div>,
    children: [
      {
        path: '/',
        element: <ProductsList />,
      },
      {
        path: '/products/:id',
        element: <ProductDetails />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
    ]
  },
]); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)