// --- Backend: server.js ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', TodoSchema);

// CRUD Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });
  const newTodo = new Todo({ task });
  await newTodo.save();
  res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
  res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));