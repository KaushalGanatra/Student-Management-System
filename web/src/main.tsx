import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheets/index.css'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import StudentForm from './components/Form.tsx';
import StudentAttendence from './pages/StudentAttendence.tsx';

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
  },
  {
    path: '/attendence',
    element: <StudentAttendence />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
