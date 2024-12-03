import { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, Row, Col, Alert, Spinner, Container, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Student, validationSchema, Class, Division } from '../structures/Types';
import { fetchClasses, fetchDivisions } from '../utils/api';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [student, setStudent] = useState<Student>({
    name: '',
    class: '',  
    division: '',  
    gender: '',
  });

  useEffect(() => {
    fetchClasses().then((classResponse) => {
      setClasses(classResponse);
    });

    fetchDivisions().then((divisionResponse) => {
      setDivisions(divisionResponse);
    });

    if (id) {
      fetchStudentData(id);
    }
  }, [id]);

  const fetchStudentData = async (studentId: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Student>(`http://localhost:5027/api/student/${studentId}`);
      setStudent(response.data);  
    } catch (err) {
      setError('Error fetching student data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Student) => {
    setLoading(true);
    try {
      const selectedClass = classes.find((classItem) => classItem.id === values.class);
      const selectedDivision = divisions.find((division) => division.id === values.division);

      const updatedStudent = {
        ...values,
        class: selectedClass ? selectedClass.id : '', 
        division: selectedDivision ? selectedDivision.id : '',  
      };

      if (id) {
        await axios.put(`http://localhost:5027/api/student/${id}`, updatedStudent);
        setSuccess('Student updated successfully!');
      } else {
        await axios.post('http://localhost:5027/api/student', updatedStudent);
        setSuccess('Student added successfully!');
      }
      navigate('/');
    } catch (err) {
      setError('Error while submitting form!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-3">
      <Card className="p-3 shadow-sm">
        <h2 className="text-center mb-4">{id ? 'Edit Student' : 'Add New Student'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Formik
          initialValues={student}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} 
        >
          {({ touched, errors, isSubmitting, setFieldValue, values }) => {
            useEffect(() => {
              if (id && student) {
                const selectedClass = classes.find((classItem) => classItem.classNumber === student.class);
                const selectedDivision = divisions.find((division) => division.divisionName === student.division);

                if (selectedClass) {
                  setFieldValue('class', selectedClass.id);  
                }
                if (selectedDivision) {
                  setFieldValue('division', selectedDivision.id);  
                }
              }
            }, [id, student, classes, divisions, setFieldValue]);

            return (
              <Form>
                <Row className="mb-3">
                  <Col xs={12}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>Full Name</BootstrapForm.Label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                        placeholder="Full Name"
                      />
                      <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={12} sm={6}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>Class</BootstrapForm.Label>
                      <Field
                        as="select"
                        name="class"
                        id="class"
                        className={`form-control ${touched.class && errors.class ? 'is-invalid' : ''}`}
                        value={values.class}  
                        onChange={e => {
                          const selectedClassId = e.target.value;
                          setFieldValue('class', selectedClassId);  
                        }}
                      >
                        <option value="">Select Class...</option>
                        {classes.map((classItem) => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.classNumber}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="class" component="div" className="invalid-feedback" />
                    </BootstrapForm.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>Division</BootstrapForm.Label>
                      <Field
                        as="select"
                        name="division"
                        id="division"
                        className={`form-control ${touched.division && errors.division ? 'is-invalid' : ''}`}
                        value={values.division} 
                        onChange={e => {
                          const selectedDivisionId = e.target.value;
                          setFieldValue('division', selectedDivisionId); 
                        }}
                      >
                        <option value="">Select Division...</option>
                        {divisions.map((division) => (
                          <option key={division.id} value={division.id}>
                            {division.divisionName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="division" component="div" className="invalid-feedback" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                <Row className="mb-6">
                  <Col xs={12}>
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>Gender</BootstrapForm.Label>
                      <div className="d-flex">
                        <div className="form-check me-3">
                          <Field
                            type="radio"
                            name="gender"
                            value="Male"
                            id="genderMale"
                            className={`form-check-input ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                          />
                          <BootstrapForm.Label className="form-check-label" htmlFor="genderMale">
                            Male
                          </BootstrapForm.Label>
                        </div>
                        <div className="form-check me-3">
                          <Field
                            type="radio"
                            name="gender"
                            value="Female"
                            id="genderFemale"
                            className={`form-check-input ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                          />
                          <BootstrapForm.Label className="form-check-label" htmlFor="genderFemale">
                            Female
                          </BootstrapForm.Label>
                        </div>
                        <div className="form-check">
                          <Field
                            type="radio"
                            name="gender"
                            value="Other"
                            id="genderOther"
                            className={`form-check-input ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                          />
                          <BootstrapForm.Label className="form-check-label" htmlFor="genderOther">
                            Other
                          </BootstrapForm.Label>
                        </div>
                      </div>
                      <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  variant="primary"
                  className="me-2 w-100"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : id ? 'Update' : 'Add'}
                </Button>

                <div className="mt-3">
                  <Button variant="secondary" onClick={() => navigate('/')} className="w-100">
                    Cancel
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </Container>
  );
};

export default StudentForm;
