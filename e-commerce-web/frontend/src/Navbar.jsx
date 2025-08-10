import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

    const loggedIn = localStorage.getItem('loggedIn');
    
    const navigate = useNavigate();

    function handleLogout() {
        console.log("Logged Out.")
        localStorage.clear();
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <ul>
                <li><Link to='/'>E-commerce Website</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
                <li><Link to='/login'>Login</Link></li>
                {Boolean(loggedIn) && <li onClick={handleLogout}>Logout</li>}

            </ul>

        </nav>
    );

}

export default Navbar;