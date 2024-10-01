// routes/tasks.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Remove the following line from the top level (if present):
// const io = req.app.locals.io; // This is invalid outside route handlers

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    // Create task object
    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.id, // From auth middleware
    });

    // Save task to database
    const task = await newTask.save();

    // Access io instance within the route handler
    const io = req.app.locals.io; // Now req is defined
    io.emit('taskUpdate', task); // Emit event to all connected clients

    res.json(task);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Fetch tasks
    const tasks = await Task.find()
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    // Build task fields
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (status) taskFields.status = status;
    if (assignedTo) taskFields.assignedTo = assignedTo;

    // Find and update task
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    // Access io instance within the route handler
    const io = req.app.locals.io; // Now req is defined
    io.emit('taskUpdate', task); // Emit updated task to all clients

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find task
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Delete task
    await Task.findByIdAndRemove(req.params.id);

    // Access io instance within the route handler
    const io = req.app.locals.io; // Now req is defined
    io.emit('taskDelete', req.params.id); // Notify clients of deletion

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
