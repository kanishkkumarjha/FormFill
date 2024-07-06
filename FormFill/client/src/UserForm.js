import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './styles.css'; // Import the CSS file

const UserForm = () => {
    const [form, setForm] = useState({
        name: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const { name, dateOfBirth, email } = form;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dob = new Date(dateOfBirth);
        const age = new Date().getFullYear() - dob.getFullYear();
        if (!name) return 'Name is required';
        if (!email || !emailRegex.test(email)) return 'Invalid email';
        if (!dateOfBirth || age < 18) return 'Age must be 18 or older';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            const response = await axios.post(`${window.location.origin}/submit-form`, form);
            setMessage(response.data.message);
            setError('');
            navigate('/submitted-forms'); // Redirect on success
        } catch (error) {
            setError(error.response.data.message || 'Form submission failed');
        }
    };

    return (
        <div className="container2">
            <h1>User Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserForm;
