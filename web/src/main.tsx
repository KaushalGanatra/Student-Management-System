import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheets/index.css'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import StudentList from './components/List.tsx';
import StudentForm from './components/Form.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/form",
    element: <StudentForm />
  },
  {
    path: '/form/:id',
    element: <StudentForm />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
