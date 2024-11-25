import './App.css';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Table, Button, Spinner, Card, Modal, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Student } from './Types';
import 'bootstrap-icons/font/bootstrap-icons.css';

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConformation, setShowConformation] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleClose = () => setShowConformation(false);
  const handleOpen = (student: Student) => {
    if (student.id !== undefined) {
      setStudentToDelete(student);
      setShowConformation(true);
    } else {
      console.error("Student ID is undefined.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<Student[]> = await axios.get('http://localhost:5027/api/student');
      setStudents(response.data);
      setFilteredStudents(response.data);
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
      <div className="search-container mb-4">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <FormControl
            placeholder="Search by Student Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        
        {searchQuery && (
          <ListGroup className="suggestions-list">
            {filteredStudents.map((student) => (
              <ListGroup.Item
                key={student.id}
                action
                onClick={() => {
                  setSearchQuery(student.name);
                  setFilteredStudents([student]);
                }}
              >
                {student.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
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
                          onClick={() => handleOpen(student)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">No students found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showConformation} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentToDelete && (
            <>
              Are you sure you want to delete {studentToDelete.name}'s data
              (Class: {studentToDelete.class} - {studentToDelete.division})?
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No, don't delete it
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (studentToDelete && studentToDelete.id !== undefined) {
                handleDelete(studentToDelete.id);
                handleClose();
              }
            }}
          >
            Yes, delete it
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StudentList;
