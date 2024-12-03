import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ListProps } from '../structures/Types';
import ConfirmationModal from '../components/ConfirmationModal';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

      <ConfirmationModal
        show={showConformation}
        studentToDelete={studentToDelete}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSubmission={handleDelete}
        message="Are you sure you want to delete this student?"
        actionLabel="Delete"
      />
    </div>
  );
};

export default List;
