// src/components/TaskItem.js
import React, { useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TaskItem = ({ task }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  // Function to handle task deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      // Optionally, emit a socket event or refresh the task list
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      {task.assignedTo && <p>Assigned to: {task.assignedTo.username}</p>}
      <div className="task-actions">
        <button onClick={() => setShowEditForm(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>

      {showEditForm && (
        <TaskForm
          task={task}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;
