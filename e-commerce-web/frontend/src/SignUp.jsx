import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {

    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormValues(fv => ({...fv, [name]: value}))
    }

    function handleSubmit(e) {
        e.preventDefault(); // try without this to see what it does

        axios.post('http://localhost:5000/signup', formValues)
        .then(response => {
            console.log(response.data);
            navigate('/login');
        })
        .catch(error => {
            if (error.response) {
                setError(error.response.data.message);
            }
            else {
                setError("An error occured. Please try again later.")
            }
        })
    }

    return (

        <div className="access-container">

            <h1>Sign Up</h1>
            
            <form onSubmit={handleSubmit}>

                {error && <div className="error-message">{error}</div>}

                <div className="form-section">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={formValues.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-section">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-section">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="access-btn">Sign Up</button>

            </form>

            <div>Already have an account? <Link to="/login">Login</Link></div>

        </div>

    );

}

export default SignUp;