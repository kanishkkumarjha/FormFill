import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import the CSS file

const HomePage = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/user-form');
    };

    return (
        <div className="container2">
            <h1>Welcome to the User Form Application</h1>
            <p>Please click the button below to fill out the user form.</p>
            <button onClick={handleButtonClick}>
                Go to User Form
            </button>
        </div>
    );
};

export default HomePage;