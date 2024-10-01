// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import axios from 'axios';

const Register = () => {
  // State variables
  const [username, setUsername] = useState(''); // Changed from 'name' to 'username'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(''); // To handle registration errors

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending a POST request to the server for registration
      const response = await axios.post('/api/auth/register', { username, email, password });

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to the dashboard after successful registration
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {/* Display error message if there is an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
        <button type="submit">Register</button>
      </form>

      {/* Link to Login Page */}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
