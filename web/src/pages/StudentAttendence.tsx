import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Student, Class, Division, AttendenceData } from '../structures/Types';
import { Table, Button, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import '../stylesheets/App.css';
import { fetchClasses, fetchDivisions, baseUrl } from '../utils/api';

const StudentAttendance = () => {
  const [attendanceByDate, setAttendanceByDate] = useState<AttendenceData[]>([]);

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [todayDate, setTodayDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [enableSubmit, setEnableSubmit] = useState<boolean>(true);
  const [submitLabel, setSubmitLabel] = useState<string>('Submit');
  
  const [badgeColor, setBadgeColor] = useState<string>('primary');
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

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

      if ((err as AxiosError).response?.status === 404) {
        setStudents([]);
      }
    }
  }, [selectedClass, selectedDivision]);

  useEffect(() => {
    fetchClasses().then(classResponse => {
      setClasses(classResponse);
    });
    fetchDivisions().then(divisionResponse => {
      setDivisions(divisionResponse);
    });
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setTodayDate(new Date().toISOString().split('T')[0]);
    fetchStudents();
  }, []);

  const fetchAttendance = useCallback(async (date: string) => {
    setLoading(true);
    const attendanceUrl = `${baseUrl}/attendance?attendenceDate=` + date;
    try {
      const attendanceResponse: AxiosResponse<AttendenceData[]> = await axios.get(attendanceUrl);
      setAttendanceByDate(attendanceResponse.data);
    } catch (err) {
      setAttendanceByDate([]);
    }
    setLoading(false);
  }, []);

  const addAttendence = useCallback(async (attendanceData: AttendenceData[]) => {
    setLoading(true);
    const attendenceUrl = `${baseUrl}/attendance`;
    await axios.post(attendenceUrl, attendanceData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedDivision, fetchStudents]);

  useEffect(() => {
    setAttendanceByDate([]); 
  
    if (selectedDate > todayDate) {
      console.log("Future date");
      setEnableSubmit(false);
      setSubmitLabel('Submit');
      setBadgeColor('info');
      setAttendanceStatus('Cannot fill in advance');
    } else if (selectedDate < todayDate) {
      console.log("Past date");
      fetchAttendance(selectedDate); 
      setEnableSubmit(true);  
    } else {
      console.log("Current date");
      fetchAttendance(selectedDate); 
      setEnableSubmit(true);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate < todayDate) {  
      if (attendanceByDate.length === 0) {
        setSubmitLabel('Submit');
        setAttendanceStatus('Not filled');
        setBadgeColor('warning');
      } else {
        setSubmitLabel('Edit');
        setAttendanceStatus('Filled');
        setBadgeColor('success');
      }
    } else if (selectedDate == todayDate) {
      if(attendanceByDate.length !== 0) {
        setSubmitLabel('Edit');
        setAttendanceStatus('Filled');
        setBadgeColor('success');
      } else {
        setSubmitLabel('Submit');
        setAttendanceStatus('Pending');
        setBadgeColor('warning');
      }
    }
  }, [attendanceByDate, selectedDate]);

  const handleSubmit = (values: AttendenceData, { setSubmitting }: FormikHelpers<AttendenceData>) => {
    const attendanceData = students.map((student) => ({
      studentId: student.id,
      attendenceDate: values.date || selectedDate,
      isPresent: values[`attendance-${student.id}`] || false,
    }));

    addAttendence(attendanceData);
    setSubmitting(false);
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
  };

  const handleRowClick = (studentId: string, setFieldValue: Function) => {
    const currentValue = students.find((student) => student.id === studentId);
    const fieldName = `attendance-${studentId}`;
    setFieldValue(fieldName, !currentValue?.attendanceStatus);
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
              enableReinitialize={true} 
              initialValues={{
                class: selectedClass,
                division: selectedDivision,
                date: selectedDate,
                ...students.reduce((acc, student) => {
                  const attendance = attendanceByDate.find((attendanceData) => attendanceData.studentId === student.id);
                  acc[`attendance-${student.id}`] = attendance ? attendance.isPresent : false;
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

                  <h3>
                    <Badge bg={badgeColor} pill>
                      {attendanceStatus}
                    </Badge>
                  </h3>

                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
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
                            <tr key={student.id} onClick={() => handleRowClick(student.id, setFieldValue)}>
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
                  )}

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
