import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:1000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Please login with your new credentials.");
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return ( <
        div className = "register-container" >
        <
        div className = "register-box" >
        <
        h2 > Register < /h2> <
        form onSubmit = { handleSubmit } >
        <
        div className = "input-group" >
        <
        label htmlFor = "username" > Username: < /label> <
        input type = "text"
        id = "username"
        value = { username }
        onChange = {
            (e) => setUsername(e.target.value)
        }
        required /
        >
        <
        /div> <
        div className = "input-group" >
        <
        label htmlFor = "password" > Password: < /label> <
        input type = "password"
        id = "password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        required /
        >
        <
        /div> <
        div className = "input-group" >
        <
        label htmlFor = "confirmPassword" > Confirm Password: < /label> <
        input type = "password"
        id = "confirmPassword"
        value = { confirmPassword }
        onChange = {
            (e) => setConfirmPassword(e.target.value)
        }
        required /
        >
        <
        /div> <
        button type = "submit"
        className = "register-button" > Register < /button> <
        p className = "login-prompt" >
        Have an account ? { ' ' } <
        button type = "button"
        onClick = { handleLoginClick } > Login <
        /button> < /
        p > <
        /form> < /
        div > <
        /div>
    );
};

export default Register;