import './App.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Attendence() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const [studentLength, setStudentLength] = useState(20);
  useEffect(() => {
    setStudentLength(15);
  }, []);

  const submitHandler = () => {
    const obj = {
      'date': date,
      'data': {
        //id: isPresent
        1: true,
        2: true,
        3: false
      }
    }

    console.log(obj)
  }

  return (
    <>
    <div>
      <Container>
      <h3>{date}</h3>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Roll Number</th>
              {Array.from({ length: studentLength }, (_, i) => (
                <th key={i+1}>{i+1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
              <tr>
                <th>Attendence</th>
                {Array.from({ length: studentLength }, (_, i) => (
                  <td key={i}>
                    <input type='checkbox' />
                  </td>
                ))}
              </tr>
          </tbody>
        </Table>
        <button onClick={submitHandler}>SUBMIT</button>
      </Container>
    </div>
    </>
  );
}

export default Attendence;