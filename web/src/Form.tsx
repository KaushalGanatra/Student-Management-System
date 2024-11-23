import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';  
import { Link } from 'react-router-dom'; 
import { useParams, useHistory } from 'react-router-dom';  

function BootstrapForm() {
    const { id } = useParams();  
    const [student, setStudent] = useState({ name: '', class: '', division: '', gender: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) {
            fetchStudentData(id);
        }
    }, [id]);

    const fetchStudentData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5027/api/student/${id}`);
            setStudent(response.data);
        } catch (err) {
            setError('Error fetching student data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axios.put(`http://localhost:5027/api/student/${id}`, student);
                setSuccess('Student Updated Successfully!');
            } else {
                await axios.post('http://localhost:5027/api/student', student);
                setSuccess('Student Added Successfully!');
            }
            setLoading(false);
            setStudent({ name: '', class: '', division: '', gender: '' });
        } catch (err) {
            setError('Error while submitting form!');
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="Name">
                <Form.Label>Student Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="Enter Name" 
                    value={student.name} 
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Class">
                <Form.Label>Class</Form.Label>
                <Form.Control 
                    type="number" 
                    name="class"
                    placeholder="Enter Class"
                    value={student.class}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Division">
                <Form.Label>Division</Form.Label>
                <Form.Control 
                    as="select" 
                    name="division"
                    value={student.division}
                    onChange={handleChange}
                >
                    <option>Choose...</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="Gender">
                <Form.Label>Gender</Form.Label>
                <Form.Check 
                    type="radio" 
                    name="gender"
                    label="Male"
                    value="Male"
                    checked={student.gender === 'Male'}
                    onChange={handleChange}
                />
                <Form.Check 
                    type="radio" 
                    name="gender"
                    label="Female"
                    value="Female"
                    checked={student.gender === 'Female'}
                    onChange={handleChange}
                />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </Button>
            <div><Link to={{ pathname: `/list`}}>Check Student List</Link></div>
        </Form>
    );
}

export default BootstrapForm;
