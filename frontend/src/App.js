// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Existing code */}
      <header className="App-header">
        {/* ... */}
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* PrivateRoute for authenticated users */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
