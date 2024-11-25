// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:1000';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( <
    BrowserRouter >
    <
    App / >
    <
    /BrowserRouter>
);