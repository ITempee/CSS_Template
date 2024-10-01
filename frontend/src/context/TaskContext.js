// src/context/TaskContext.js

import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import io from 'socket.io-client';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io client only once when authState.token changes
  useEffect(() => {
    if (authState.token) {
      const newSocket = io('http://localhost:5000', {
        query: { token: authState.token },
      });

      setSocket(newSocket);

      // Clean up the socket connection when the component unmounts or authState.token changes
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [authState.token]);

  // Handle Socket.io events
  useEffect(() => {
    if (socket) {
      // Listen for task updates
      socket.on('taskUpdate', (updatedTask) => {
        setTasks((prevTasks) => {
          const index = prevTasks.findIndex((task) => task._id === updatedTask._id);
          if (index !== -1) {
            // Update existing task
            const newTasks = [...prevTasks];
            newTasks[index] = updatedTask;
            return newTasks;
          } else {
            // Add new task
            return [updatedTask, ...prevTasks];
          }
        });
      });

      // Listen for task deletions
      socket.on('taskDelete', (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      });

      // Clean up listeners when socket changes or component unmounts
      return () => {
        socket.off('taskUpdate');
        socket.off('taskDelete');
      };
    }
  }, [socket]);

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { 'x-auth-token': authState.token },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Add a new task
  const addTask = async (taskData) => {
    try {
      await axios.post('/api/tasks', taskData, {
        headers: { 'x-auth-token': authState.token },
      });
      // Task will be added via socket event
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { 'x-auth-token': authState.token } }
      );
      // Task update will be handled via socket event
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
