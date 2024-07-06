import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import './styles.css'; // Import the CSS file

const SubmittedForms = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            const response = await axios.get(`${window.location.origin}/forms`);
            setForms(response.data);
        };
        fetchForms();
    }, []);

    return (
        <div className="container">
            <div className="header">
                <h1>Submitted Forms</h1>
                <Link to="/" className="back-button">Back to Home</Link>
            </div>
            {forms.length === 0 ? (
                <p>No forms submitted yet.</p>
            ) : (
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form) => (
                            <tr key={form._id}>
                                <td>{form.name}</td>
                                <td>{new Date(form.dateOfBirth).toLocaleDateString()}</td>
                                <td>{form.email}</td>
                                <td>{form.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SubmittedForms;
