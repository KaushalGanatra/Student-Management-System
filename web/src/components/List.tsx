// src/components/List.tsx
import { Table, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Student } from '../structures/Types';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ListProps {
  students: Student[];
  filteredStudents: Student[];
  loading: boolean;
  handleOpen: (student: Student) => void;
  handleDelete: (id: string) => void;
  showConformation: boolean;
  handleClose: () => void;
  studentToDelete: Student | null;
}

const List: React.FC<ListProps> = ({
  filteredStudents,
  loading,
  handleOpen,
  handleDelete,
  showConformation,
  handleClose,
  studentToDelete,
}) => {
  return (
    <div className="table-container text-center">
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover className="student-table">
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
                    <Button variant="outline-danger" onClick={() => handleOpen(student)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

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
};

export default List;
