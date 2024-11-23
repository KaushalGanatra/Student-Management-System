import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import List from './List.tsx';
import Form from './Form.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/list",
    element: <List />
  },
  {
    path: "/form",
    element: <Form />
  },
  {
    path: '/form/:id',
    element: <Form />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
    <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
)
