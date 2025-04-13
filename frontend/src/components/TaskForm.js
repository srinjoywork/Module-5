import React, { useState, useEffect } from 'react';

function TaskForm({ token, task, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSubject(task.subject);
      setPriority(task.priority);
      setCompleted(task.completed);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title || !subject || !priority) {
      setError('Please fill in all fields.');
      return;
    }
    if (priority <= 0) {
      setError('Priority must be a positive number.');
      return;
    }

    const url = task ? `https://module-5-u7b1.onrender.com/task/${task._id}` : 'https://module-5-u7b1.onrender.com/task';
    const method = task ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, subject, priority, completed }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Could not save the task');
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {task ? 'Edit Task' : 'Add Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <input
              id="priority"
              type="number"
              min="1"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Completed Status Toggle */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted(!completed)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm">{completed ? 'Completed' : 'Incomplete'}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {task ? 'Edit' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Close
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
