import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import axios, { AxiosResponse } from 'axios';
import { Student } from '../structures/Types';
import { Table, Button, Card, Row, Col } from 'react-bootstrap';
import '../stylesheets/App.css';

const classes = ['1', '2', '3'];
const divisions = ['A', 'B', 'C', 'D'];

const StudentAttendence = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetchStudents();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);  
  }, []);

  const fetchStudents = async () => {
    try {
      const response: AxiosResponse<Student[]> = await axios.get('http://localhost:5027/api/student');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSubmit = (values: any) => {
    const attendanceData = students.map((student) => ({
      studentId: student.id,
      date: values.date || selectedDate,
      isPresent: values[`attendance-${student.id}`] || false,
    }));

    console.log('Attendance data:', attendanceData);
  };

  return (
    <div className="student-list-container">
      <div className="header-search-container p-0">
        <Card className="header-card mb-0">
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <h2 className="mb-0">Student Attendance</h2>
            <Link to={"/"} className="ms-auto">
              <Button variant="light" className="d-flex align-items-center">
                <span><i className="bi bi-arrow-left"></i>Back</span>
              </Button>
            </Link>
          </Card.Header>
          <Card.Body>
            <Formik
              initialValues={{
                class: '',
                division: '',
                date: selectedDate,
                ...students.reduce((acc, student) => {
                  acc[`attendance-${student.id}`] = false;
                  return acc;
                }, {} as Record<string, boolean>),
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <Row className="mb-3">
                    <Col sm={4}>
                      <Field as="select" name="class" className="form-control">
                        <option value="">Select Class</option>
                        {classes.map((cls, idx) => (
                          <option key={idx} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </Field>
                    </Col>
                    <Col sm={4}>
                      <Field as="select" name="division" className="form-control">
                        <option value="">Select Division</option>
                        {divisions.map((div, idx) => (
                          <option key={idx} value={div}>
                            {div}
                          </option>
                        ))}
                      </Field>
                    </Col>
                    <Col sm={4}>
                      <Field
                        type="date"
                        name="date"
                        className="form-control"
                        value={values.date || selectedDate}
                        onChange={(e) => setFieldValue('date', e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Table striped bordered hover className="student-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>
                            <Field
                              type="checkbox"
                              name={`attendance-${student.id}`}
                              checked={values[`attendance-${student.id}`]}
                              onChange={(e) =>
                                setFieldValue(`attendance-${student.id}`, e.target.checked)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Button className="float-right" type="submit">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendence;
