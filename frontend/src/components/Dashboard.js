// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard = () => {
  // State for tasks grouped by status
  const [tasks, setTasks] = useState({
    todo: [],
    'in-progress': [],
    done: [],
  });

  // State to control the display of the task creation form
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Initialize Socket.io client
  const socket = io('http://localhost:5000');

  useEffect(() => {
    // Function to fetch tasks from the backend
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });

        // Group tasks by status
        const groupedTasks = {
          todo: [],
          'in-progress': [],
          done: [],
        };

        res.data.forEach((task) => {
          groupedTasks[task.status].push(task);
        });

        setTasks(groupedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();

    // Listen for task updates
    socket.on('taskUpdate', (updatedTask) => {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        // Remove task from previous status
        Object.keys(newTasks).forEach((status) => {
          newTasks[status] = newTasks[status].filter((task) => task._id !== updatedTask._id);
        });

        // Add task to the new status
        newTasks[updatedTask.status].push(updatedTask);

        return newTasks;
      });
    });

    // Cleanup socket connection on unmount
    return () => socket.disconnect();
  }, [socket]);

  // Function to handle task creation
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [newTask.status]: [...prevTasks[newTask.status], newTask],
    }));
  };

  return (
    <div className="dashboard">
      <h1>Project Management Dashboard</h1>
      <button onClick={() => setShowTaskForm(true)}>Create New Task</button>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      <div className="task-lists">
        <TaskList title="To Do" status="todo" tasks={tasks.todo} />
        <TaskList title="In Progress" status="in-progress" tasks={tasks['in-progress']} />
        <TaskList title="Done" status="done" tasks={tasks.done} />
      </div>
    </div>
  );
};

export default Dashboard;
