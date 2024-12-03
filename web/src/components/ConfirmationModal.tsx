import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DeleteConfirmationModalProps } from '../structures/Types';

const ConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  studentToDelete,
  handleClose,
  handleDelete,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
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
  );
};

export default ConfirmationModal;
