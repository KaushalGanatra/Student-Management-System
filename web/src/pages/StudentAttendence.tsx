import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Student, Class, Division, AttendenceData } from '../structures/Types';
import { Table, Button, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import '../stylesheets/App.css';
import { fetchClasses, fetchDivisions, baseUrl } from '../utils/api';
import ConfirmationModal from '../components/ConfirmationModal';

const StudentAttendance = () => {
  const [attendanceByDate, setAttendanceByDate] = useState<AttendenceData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [todayDate, setTodayDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [submitLabel, setSubmitLabel] = useState<string>('Submit');
  const [badgeColor, setBadgeColor] = useState<string>('primary');
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [attendanceToSubmit, setAttendanceToSubmit] = useState<AttendenceData[] | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      let params = new URLSearchParams();
      if (selectedClass) params.append('sClassId', selectedClass);
      if (selectedDivision) params.append('sDivisionId', selectedDivision);

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

  const submitAttendance = async (attendanceData: AttendenceData[]) => {
    setLoading(true);
    try {
      const attendenceUrl = `${baseUrl}/attendance`;
      await axios.post(attendenceUrl, attendanceData);
      setLoading(false);
      setShowConfirmation(false);
      setSubmitLabel('Submitted');
      setAttendanceStatus('Filled');
      setBadgeColor('success');
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setLoading(false);
    }
  };

  const handleSubmit = (values: AttendenceData, { setSubmitting }: FormikHelpers<AttendenceData>) => {
    const attendanceData = students.map((student) => ({
      studentId: student.id,
      attendenceDate: values.date || selectedDate,
      isPresent: values[`attendance-${student.id}`] || false,
    }));

    setAttendanceToSubmit(attendanceData);
    setShowConfirmation(true); 
    setSubmitting(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmSubmission = async () => {
    if (attendanceToSubmit) {
      await submitAttendance(attendanceToSubmit);
    }
  };

  useEffect(() => {
    fetchClasses().then(classResponse => setClasses(classResponse));
    fetchDivisions().then(divisionResponse => setDivisions(divisionResponse));
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setTodayDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    fetchStudents(); 
  }, [selectedClass, selectedDivision, fetchStudents]);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate > todayDate) {
      setSubmitLabel('Submit');
      setAttendanceStatus('Cannot submit in advance');
      setBadgeColor('info');
    } else if (attendanceByDate.length === 0) {
      setSubmitLabel('Submit');
      setAttendanceStatus('Not filled');
      setBadgeColor('warning');
    } else {
      setSubmitLabel('Submitted');
      setAttendanceStatus('Filled');
      setBadgeColor('success');
    }
  }, [attendanceByDate, selectedDate, todayDate]);

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
                          setSelectedClass(e.target.value);
                          setFieldValue('class', e.target.value);
                        }}
                        value={values.class}
                      >
                        <option value="">Select Class</option>
                        {classes.length > 0 && classes.map((classItem) => (
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
                          setSelectedDivision(e.target.value);
                          setFieldValue('division', e.target.value);
                        }}
                        value={values.division}
                      >
                        <option value="">Select Division</option>
                        {divisions.length > 0 && divisions.map((division) => (
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
                        value={selectedDate}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setSelectedDate(e.target.value);
                          setFieldValue('date', e.target.value);
                        }}
                      />
                    </Col>
                  </Row>

                  <Table bordered responsive>
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
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue(`attendance-${student.id}`, e.target.checked)}
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

                  <div className="d-flex justify-content-end">
                    {submitLabel === 'Submit' && selectedDate <= todayDate && (
                      <Button
                        variant="success"
                        type="submit"
                        disabled={loading || selectedDate > todayDate}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : submitLabel}
                      </Button>
                    )}
                    {submitLabel === 'Submitted' && (
                      <Badge bg={badgeColor}>{attendanceStatus}</Badge>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>

      <ConfirmationModal
        show={showConfirmation}
        studentToDelete={null}
        handleClose={handleCloseConfirmation}
        handleDelete={handleConfirmSubmission}
        handleSubmission={handleConfirmSubmission}
        message="Are you sure you want to mark attendance for this date?"
        actionLabel="Confirm Attendance"
      />
    </div>
  );
};

export default StudentAttendance;