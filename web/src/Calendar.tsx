import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import interactionPlugin from '@fullcalendar/interaction'; 
import { useNavigate, createSearchParams, Link } from "react-router-dom";

function Calender() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendenceDone,setAttendenceDone] = useState(false);

  const handleDateClick = (arg) => {
    console.log(arg.dateStr)
    setSelectedDate(arg.dateStr);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
    <Container>
    <h1><u>Student Attendence System</u></h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <p>Attendance for the date {selectedDate} is {attendenceDone ? <b>Done</b> : <b>Not Done</b>}</p>
  {attendenceDone ? (
    <Link to={{ pathname: `/attendence`, search: `?date=${selectedDate}` }}>Edit Attendance</Link>
  ) : (
    <Link to={{ pathname: `/attendence`, search: `?date=${selectedDate}` }}>Fill Up Attendance</Link>
  )}
</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </>
  );
}

export default Calender;