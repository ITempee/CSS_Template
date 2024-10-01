// server.js

/**
 * Main server file for the Collaborative Project Management Tool
 * This file sets up the Express server, connects to MongoDB,
 * initializes Socket.io for real-time communication,
 * and configures routes and middleware.
 */

// ===========================
// Import Required Modules
// ===========================
const express = require('express');         // Web framework for Node.js
const http = require('http');               // Node.js HTTP server
const socketIo = require('socket.io');      // Socket.io for real-time communication
const mongoose = require('mongoose');       // MongoDB ORM
const cors = require('cors');               // Middleware to enable CORS
const dotenv = require('dotenv');           // Loads environment variables
const path = require('path');               // Utilities for file and directory paths

// ===========================
// Load Environment Variables
// ===========================
// Make sure to create a .env file in the backend directory with your variables
dotenv.config(); // Loads variables from .env into process.env

// ===========================
// Initialize Express App
// ===========================
const app = express(); // Creates an Express application

// ===========================
// Middleware Configuration
// ===========================
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// ===========================
// Create HTTP Server and Initialize Socket.io
// ===========================
const server = http.createServer(app); // Creates an HTTP server instance
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Update this if your front-end is hosted elsewhere
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// ===========================
// Socket.io Configuration
// ===========================
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for task updates from clients
  socket.on('taskUpdate', (data) => {
    // Broadcast the task update to all other clients
    socket.broadcast.emit('taskUpdate', data);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to route handlers via app locals
app.locals.io = io;

// ===========================
// MongoDB Connection
// ===========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
  // useCreateIndex: true,     // Uncomment if needed (deprecated in Mongoose 6+)
  // useFindAndModify: false,  // Uncomment if needed (deprecated in Mongoose 6+)


// ===========================
// Routes Configuration
// ===========================

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Use routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes

// ===========================
// Serve Static Assets in Production
// ===========================

// Check if in production environment
if (process.env.NODE_ENV === 'production') {
  // Set static folder to serve React app
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

  // Handle any requests that don't match the above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

// ===========================
// Default Route (For Testing)
// ===========================
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ===========================
// Start the Server
// ===========================

// Use the port specified in the environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start listening on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
