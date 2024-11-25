import './App.css';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Table, Button, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Student } from './Types';  

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
    <div>
      <Row className="mb-3 d-flex align-items-center">
        <Col>
          <h2>Student List</h2>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          {!loading && (
            <div className="d-flex align-items-center">
              <Link to={`/form`}>
                <Button variant="info">Add Student</Button>
              </Link>
            </div>
          )}
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Table striped bordered hover>
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
                      <Button variant="info">Edit</Button>
                    </Link>
                    <Button 
                        variant="danger" 
                        onClick={() => student.id && handleDelete(student.id)}
                        >
                        Delete
                        </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default StudentList;
