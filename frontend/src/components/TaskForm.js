// src/components/TaskForm.js

import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const { addTask } = useContext(TaskContext);

  const { title, description } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      return alert('Title is required');
    }
    addTask(formData);
    setFormData({ title: '', description: '' });
  };

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '16px' }}>
      <h3>Create New Task</h3>
      <input
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        placeholder="Task Title"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <textarea
        name="description"
        value={description}
        onChange={onChange}
        placeholder="Task Description"
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      ></textarea>
      <button type="submit" style={{ padding: '8px 16px' }}>
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
