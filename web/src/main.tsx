import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './stylesheets/index.css';
import App from './App.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import StudentForm from './components/Form.tsx';
import StudentList from './pages/StudentList.tsx';
import StudentAttendence from './pages/StudentAttendence.tsx';
import Layout from './components/Layout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: "/list",
    element: (
      <Layout>
        <StudentList />
      </Layout>
    ),
  },
  {
    path: "/form",
    element: (
      <Layout>
        <StudentForm />
      </Layout>
    ),
  },
  {
    path: "/form/:id",
    element: (
      <Layout>
        <StudentForm />
      </Layout>
    ),
  },
  {
    path: "/attendence",
    element: (
      <Layout>
        <StudentAttendence />
      </Layout>
    ),
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
