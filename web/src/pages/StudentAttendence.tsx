import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Formik, Field, Form } from 'formik';
import axios, { AxiosResponse } from 'axios';
import { Student, Class, Division, AttendenceData } from '../structures/Types';
import { Table, Button, Card, Row, Col } from 'react-bootstrap';
import '../stylesheets/App.css';

const StudentAttendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const baseUrl = 'http://localhost:5027/api';
  const [todayDate, setTodayDate] = useState<string>('');
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true);
  const [submitLabel, setSubmitLabel] = useState<string>('Submit');

  const fetchClasses = useCallback(async () => {
    const classUrl = `${baseUrl}/class`;
    const classResponse: AxiosResponse<Class[]> = await axios.get(classUrl);
    setClasses(classResponse.data);
  }, []);

  const fetchDivisions = useCallback(async () => {
    const divisionUrl = `${baseUrl}/division`;
    const divisionResponse: AxiosResponse<Division[]> = await axios.get(divisionUrl);
    setDivisions(divisionResponse.data);
  }, []);

  // const fetchAttendenceData = useCallback(async () => {
  //     const attendenceUrl = `${baseUrl}/attendence?attendenceDate=`+selectedDate;
  //     const attendenceReponse: AxiosResponse<AttendenceData[]> = await axios.get(attendenceUrl)
  // }, [selectedDate]);

  const fetchStudents = useCallback(async () => {
    try {
      let params = new URLSearchParams();

      if (selectedClass) {
        params.append('sClassId', selectedClass);
      }

      if (selectedDivision) {
        params.append('sDivisionId', selectedDivision);
      }

      const studentUrl = `${baseUrl}/student?${params.toString()}`;
      const response: AxiosResponse<Student[]> = await axios.get(studentUrl);
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      if (err.response?.status === 404) {
        setStudents([]);
      }
    }
  }, [selectedClass, selectedDivision]);

  useEffect(() => {
    fetchClasses();
    fetchDivisions();
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setTodayDate(new Date().toISOString().split('T')[0]);
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedDivision, fetchStudents]);

  useEffect(() => {
    if(selectedDate > todayDate) {
      setEnableSubmit(false);
      setSubmitLabel('Submit');
    } else if (selectedDate < todayDate) {
      setEnableSubmit(true);
      setSubmitLabel('Edit');
    } else {
      setEnableSubmit(true);
      setSubmitLabel('Submit');
    }
    console.log(enableSubmit);
  }, [selectedDate]);

  const handleSubmit = (values: any) => {
    const attendanceData = students.map((student) => ({
      studentId: student.id,
      date: values.date || selectedDate,
      isPresent: values[`attendance-${student.id}`] || false,
    }));

    console.log('Attendance data:', attendanceData);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedClass(value);
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDivision(value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
  }

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
                class: selectedClass,
                division: selectedDivision,
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
                      <Field
                        as="select"
                        name="class"
                        className="form-control"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          handleClassChange(e);
                          setFieldValue('class', e.target.value);
                        }}
                        value={values.class}
                      >
                        <option value="">Select Class</option>
                        {classes.map((classItem) => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.classNumber}
                          </option>
                        ))}
                      </Field>
                    </Col>
                    <Col sm={4}>
                      <Field
                        as="select"
                        name="division"
                        className="form-control"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          handleDivisionChange(e);
                          setFieldValue('division', e.target.value);
                        }}
                        value={values.division}
                      >
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                          <option key={division.id} value={division.id}>
                            {division.divisionName}
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
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          handleDateChange(e);
                          setFieldValue('date', e.target.value);
                        }}
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
                      {students.length > 0 ? (
                        students.map((student) => (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <Button className="float-right" type="submit" disabled={!enableSubmit}>
                    {submitLabel}
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

export default StudentAttendance;
