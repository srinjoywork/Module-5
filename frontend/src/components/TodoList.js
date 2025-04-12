import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";



function TodoList({ token, updateToken }) {
  const [cachedTasks, setCachedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("priority");
  const [sortDirection, setSortDirection] = useState("desc");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (cachedTasks.length > 0) {
      const sortedTasks = sortTasks(cachedTasks, sort, sortDirection);
      const paginatedTasks = sortedTasks.slice((page - 1) * 5, page * 5);
      setTasks(paginatedTasks);
    } else {
      fetchTasks();
    }
  }, [page, sort, sortDirection, cachedTasks]);

const fetchTasks = async () => {
  setIsLoading(true);
  try {
    const res = await fetch(`http://localhost:8080/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Could not fetch tasks");
    }
    const data = await res.json();
    setCachedTasks(data.tasks);
    const sortedTasks = sortTasks(data.tasks, sort, sortDirection);
    setTasks(sortedTasks.slice((page - 1) * 5, page * 5));
    setTotalItems(data.totalItems);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

const sortTasks = (tasksToSort, sortType, direction) => {
  const sorted = [...tasksToSort];
  if (sortType === "priority") {
    sorted.sort((a, b) =>
      direction === "desc" ? b.priority - a.priority : a.priority - b.priority
    );
  } else if (sortType === "createdAt") {
    sorted.sort((a, b) =>
      direction === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortType === "completed") {
    sorted.sort((a, b) =>
      direction === "desc"
        ? a.completed === b.completed
          ? 0
          : a.completed
          ? 1
          : -1
        : a.completed === b.completed
        ? 0
        : a.completed
        ? -1
        : 1
    );
  }
  return sorted;
};

const toggleComplete = async (id) => {
  try {
    const res = await fetch(`http://localhost:8080/taskComplete/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Could not change the status");
    fetchTasks();
  } catch (err) {
    setError(err.message);
  }
};

const deleteTask = async (id) => {
  if (window.confirm("Are you sure you want to delete this?")) {
    try {
      const res = await fetch(`http://localhost:8080/task/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not delete task");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }
};

  

return (
  <div className="font-sans bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
    {/* Navbar */}
    <nav className="bg-white/80 backdrop-blur-md p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-blue-800 text-2xl font-bold tracking-wide">📝 Todo App</h1>
        <button
          onClick={() => updateToken(null)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition"
        >
          Logout
        </button>
      </div>
    </nav>

    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 drop-shadow-md">
        Manage Your Tasks
      </h2>

      {/* Add Task Button and Filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={() => {
            setEditTask(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 shadow-md transition font-medium"
        >
          ➕ Add Task
        </button>

        <div className="flex items-center space-x-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 bg-white shadow-sm"
          >
            <option value="priority">Sort by priority</option>
            <option value="createdAt">Sort by date</option>
            <option value="completed">Sort by status</option>
          </select>
          <button
            onClick={() =>
              setSortDirection(sortDirection === "desc" ? "asc" : "desc")
            }
            className="bg-white px-4 py-2 rounded-lg hover:bg-gray-100 border shadow-sm transition font-medium"
          >
            {sortDirection === "desc" ? "⬇ Desc" : "⬆ Asc"}
          </button>
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available!</p>
      ) : (
        <ul className="space-y-5">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-md transition group ${
                task.completed
                  ? "bg-green-100 opacity-50 line-through text-gray-500"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {task.title}
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>🎯 Priority: {task.priority}</p>
                    <p>📚 Subject: {task.subject}</p>
                    <p className="text-gray-500">
                      🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 flex flex-col md:flex-row md:space-x-2 md:space-y-0">
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className={`px-4 py-2 rounded-md font-medium ${
                      task.completed
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white shadow-sm transition`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-200 px-5 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          ⬅ Previous
        </button>
        <span className="text-lg font-semibold">{page}</span>
        <button
          disabled={page * 5 >= totalItems}
          onClick={() => setPage(page + 1)}
          className="bg-gray-200 px-5 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next ➡
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
      )}

      {/* Task Form Modal */}
      {showModal && (
        <TaskForm
          token={token}
          task={editTask}
          onClose={() => setShowModal(false)}
          onSave={fetchTasks}
        />
      )}
    </div>
  </div>
);

}

export default TodoList;
