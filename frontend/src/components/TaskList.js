// src/components/TaskList.js

import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ title, status, tasks }) => {
  return (
    <div className="task-list">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
