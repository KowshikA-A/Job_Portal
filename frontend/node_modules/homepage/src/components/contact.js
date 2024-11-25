import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [message, setMessage] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');

        const handleSubmit = async(event) => {
            event.preventDefault();

            const data = {
                name,
                email,
                message,
            };

            try {
                const response = await fetch('http://localhost:1000/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to send message: ${errorData.message}`);
                }

                setSuccess('Message sent successfully!');
                setName('');
                setEmail('');
                setMessage('');
                setError('');
            } catch (error) {
                console.error('Error sending message:', error);
                setError(error.message);
                setSuccess('');
            }
        };

        return ( <
                div className = "contact-page" >
                <
                h2 > Contact Us < /h2> <
                div className = "form-container" >
                <
                form onSubmit = { handleSubmit } >
                <
                div className = "form-group" >
                <
                label htmlFor = "name" > Name: < /label> <
                input type = "text"
                id = "name"
                value = { name }
                onChange = {
                    (e) => setName(e.target.value) }
                required /
                >
                <
                /div> <
                div className = "form-group" >
                <
                label htmlFor = "email" > Email: < /label> <
                input type = "email"
                id = "email"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                required /
                >
                <
                /div> <
                div className = "form-group" >
                <
                label htmlFor = "message" > Message: < /label> <
                textarea id = "message"
                value = { message }
                onChange = {
                    (e) => setMessage(e.target.value) }
                required >
                < /textarea> <
                /div> <
                button type = "submit" > Send < /button> <
                /form> {
                    error && < p className = "error-message" > { error } < /p>} {
                        success && < p className = "success-message" > { success } < /p>} <
                            /div> <
                            /div>
                    );
                };

                export default Contact;