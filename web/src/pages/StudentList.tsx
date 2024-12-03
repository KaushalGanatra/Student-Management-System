import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Student } from '../structures/Types';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Search from '../components/Search';
import List from '../components/List';

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConformation, setShowConformation] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleOpen = (student: Student) => {
    if (student.id !== undefined) {
      setStudentToDelete(student);
      setShowConformation(true);
    } else {
      console.error('Student ID is undefined.');
    }
  };

  const handleClose = () => setShowConformation(false);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5027/api/student/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div className="student-list-container">
      <div className="header-search-container p-0">
        <Card className="header-card mb-0">
          <Card.Header className="bg-primary text-white">
            <Row className="d-flex align-items-center">
              <Col>
                <h2 className="mb-0">Student List</h2>
              </Col>
              <Col className="d-flex justify-content-end">
                <Link to={`/attendence`} className="me-2">
                  <Button variant="light" className="d-flex align-items-center">
                    <span className="me-0"></span> Fill Attendence
                  </Button>
                </Link>
                <Link to={`/form`}>
                  <Button variant="light" className="d-flex align-items-center">
                    <span className="me-0">+</span> Add Student
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card.Header>
        </Card>
        <Search students={students} setFilteredStudents={setFilteredStudents} />
      </div>

      <List
        students={students}
        filteredStudents={filteredStudents}
        loading={loading}
        handleOpen={handleOpen}
        handleDelete={handleDelete}
        showConformation={showConformation}
        handleClose={handleClose}
        studentToDelete={studentToDelete}
      />
    </div>
  );
};

export default StudentList;
