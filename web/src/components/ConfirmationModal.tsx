import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ConfirmationModalProps } from '../structures/Types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  studentToDelete,
  handleClose,
  handleDelete,
  handleSubmission,
  message,
  actionLabel
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{actionLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No, don't {actionLabel}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (studentToDelete && studentToDelete.id !== undefined) {
              handleDelete(studentToDelete.id);
              handleClose();
            } else {
              handleSubmission();
            }
          }}
        >
          Yes, {actionLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
