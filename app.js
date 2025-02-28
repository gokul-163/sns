// --- Frontend: src/App.js ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/todos`).then((res) => setTodos(res.data));
  }, []);

  const addTodo = () => {
    if (!task) return alert('Task cannot be empty');
    axios.post(`${API_URL}/todos`, { task }).then((res) => {
      setTodos([...todos, res.data]);
      setTask('');
    });
  };

  const updateTodo = (id, completed) => {
    axios.put(`${API_URL}/todos/${id}`, { completed: !completed }).then((res) => {
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/todos/${id}`).then(() => {
      setTodos(todos.filter((todo) => todo._id !== id));
    });
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New Task" />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.task}
            </span>
            <button onClick={() => updateTodo(todo._id, todo.completed)}>Toggle</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;