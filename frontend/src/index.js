import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'https://money-manager-backend-no0w.onrender.com';
// axios.defaults.baseURL = 'https://money-manager-backend-test.onrender.com';
// axios.defaults.baseURL = 'http://localhost:5000';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

