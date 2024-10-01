// models/Task.js

const mongoose = require('mongoose');

// Define schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Remove whitespace
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Task', TaskSchema);
