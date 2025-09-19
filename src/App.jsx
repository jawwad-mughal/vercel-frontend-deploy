import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";


function App() {
  const [todos, setTodos] = useState([]);
  const [todoItem, setTodoItem] = useState("");
  const [editId, setEditId] = useState(null);
console.log(URL)
  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${URL}`);
      setTodos(res.data.todos); // assuming { todos: [...] }
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!todoItem) return;
    try {
      await axios.post(`${URL}`, {
        todoItem,
        completed: false,
      });
      setTodoItem("");
      fetchTodos(); // ✅ refresh list after adding
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${URL}${id}`);
      fetchTodos(); // ✅ refresh list after deleting
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Update todo
  const updateTodo = async () => {
    if (!todoItem || !editId) return;
    try {
      await axios.put(`${URL}${editId}`, {
        todoItem,
      });
      setTodoItem("");
      setEditId(null);
      fetchTodos(); // ✅ refresh list after update
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${URL}${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos(); // ✅ refresh list after toggle
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  // Set todo for editing
  const startEdit = (todo) => {
    setEditId(todo._id);
    setTodoItem(todo.todoItem);
  };

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Todo App
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={todoItem}
            onChange={(e) => setTodoItem(e.target.value)}
            placeholder="Enter todo"
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          {editId ? (
            <button
              onClick={updateTodo}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Update
            </button>
          ) : (
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          )}
        </div>

        {/* List */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            
            <li
              key={todo._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="w-4 h-4"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-800"
                      : "text-gray-700"
                  }`}
                >
                  {todo.todoItem}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

