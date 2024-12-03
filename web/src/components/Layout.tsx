import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Student Managemement System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/list">Student List</Nav.Link>
              <Nav.Link href="/form">Student Form</Nav.Link>
              <Nav.Link href="/attendence">Student Attendance</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4" style={{ height: 'calc(100vh - 56px)' }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
