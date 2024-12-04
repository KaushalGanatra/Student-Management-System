import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { fetchStudents } from '../utils/api';
import { useEffect, useState } from 'react';
import { Student } from '../structures/Types';

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudents().then((studentResponse: Student[]) => {
      setStudents(studentResponse);
    });
  }, []);

    const classDivisionCounts: { [key: string]: number } = {};
    const genderCounts = {
      Male: 0,
      Female: 0,
      Other: 0
    };
  
    students.forEach(student => {
      const classDivisionKey = `${student.class}-${student.division}`;
  
      classDivisionCounts[classDivisionKey] = (classDivisionCounts[classDivisionKey] || 0) + 1;
  
      if (student.gender === 'Male') {
        genderCounts.Male += 1;
      } else if (student.gender === 'Female') {
        genderCounts.Female += 1;
      } else {
        genderCounts.Other += 1;
      }
    });

  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Dashboard</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Student Analysis</Card.Subtitle>
              </Card.Body>
            </Card>

            <Card className="mb-4">
            <Card.Header>Students Count Per Class</Card.Header>
            <ListGroup variant="flush">
              {Object.entries(classDivisionCounts).map(([classDivision, count]) => (
                <ListGroup.Item key={classDivision} className="d-flex justify-content-between align-items-center">
                  <strong>{classDivision} :</strong> {count} student(s)
                  <a 
                    href={`/list?class=${classDivision.split('-')[0]}&division=${classDivision.split('-')[1]}`} 
                    className='ms-auto'
                  >
                    View Students
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Footer>
              <small className="text-muted">Total Students: {students.length}</small>
            </Card.Footer>
          </Card>

            <Card className="mb-4">
            <Card.Header>Gender Count</Card.Header>
            <ListGroup variant="flush">
              {Object.entries(genderCounts).map(([genderType, count]) => (
                <ListGroup.Item key={genderType}>
                  <strong>{genderType} :</strong> {count}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Footer>
              <small className="text-muted">
                Genders: {Object.keys(genderCounts).join(", ")}
              </small>
            </Card.Footer>
          </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
