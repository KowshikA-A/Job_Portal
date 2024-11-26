import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin = () => {}, onSwitchToRegister = () => {} }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/');
        }
    }, [navigate]);
    const handleRegisterClick = () => {
        onSwitchToRegister();
        navigate('/register');
    };

    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:1000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin();
                localStorage.setItem('authToken', data.token);
                navigate('/');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return ( <
        div className = "login-container" >
        <
        form className = "login-form"
        onSubmit = { handleSubmit } >
        <
        h2 > Login < /h2> <
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
        button type = "submit"
        className = "login-button" >
        Login <
        /button> <
        p className = "register-prompt" >
        Don’ t have an account ? { ' ' } <
        button type = "button"
        onClick = { handleRegisterClick } >
        Register <
        /button> < /
        p > <
        /form> < /
        div >
    );
};

export default Login;
