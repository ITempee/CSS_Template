// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

const Login = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error state to handle login errors
  const [error, setError] = useState('');

  const navigate = useNavigate(); // React Router's hook to navigate programmatically

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to the dashboard
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Display error message if there is an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Field */}
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>

      {/* Link to Registration Page */}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
