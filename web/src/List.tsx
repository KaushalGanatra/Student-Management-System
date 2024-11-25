import './App.css';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Table, Button, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Student } from './Types';
import 'bootstrap-icons/font/bootstrap-icons.css';

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<Student[]> = await axios.get('http://localhost:5027/api/student');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await axios.delete(`http://localhost:5027/api/student/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <h2 className="mb-0">Student List</h2>
          <Link to={`/form`} className="ms-auto">
            <Button variant="light" className="d-flex align-items-center">
              <span className="me-2">+</span> Add Student
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Table striped bordered hover className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Division</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.division}</td>
                    <td>{student.gender}</td>
                    <td>
                      <Link to={`/form/${student.id}`}>
                        <Button variant="outline-info" className="me-2">
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        onClick={() => student.id && handleDelete(student.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default StudentList;
