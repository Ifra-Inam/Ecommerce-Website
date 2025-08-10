import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from './App.jsx';

function Login() {

    const { setLoggedIn } = useData();

    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormValues(fv => ({...fv, [name]: value}))
    }

    function handleSubmit(e) {
        e.preventDefault(); 

        axios.post('http://localhost:5000/login', formValues)
        .then(response => {
            console.log(response.data);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('tokenExp', response.data.tokenExp);
            localStorage.setItem('loggedIn', true);
            navigate('/');
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

            <h1>Login</h1>
            
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

                <button type="submit" className="access-btn">Login</button>

            </form>

            <div>Don't have an account? <Link to="/signup">Sign Up</Link></div>

        </div>

    );
    
}

export default Login;