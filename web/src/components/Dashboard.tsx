import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Bootstrap</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Since 2011</Card.Subtitle>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>Class List</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>@username</strong> Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>@username</strong> Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>@username</strong> Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </ListGroup.Item>
              </ListGroup>
              <Card.Footer>
                <small className="text-muted">All updates</small>
              </Card.Footer>
            </Card>

            <Card>
              <Card.Header>Suggestions</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Full Name</strong> @username <Button variant="link">Follow</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Full Name</strong> @username <Button variant="link">Follow</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Full Name</strong> @username <Button variant="link">Follow</Button>
                </ListGroup.Item>
              </ListGroup>
              <Card.Footer>
                <small className="text-muted">All suggestions</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
