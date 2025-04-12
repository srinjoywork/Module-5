import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import './tailwind.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProtectedRoute token={token}><TodoList token={token} updateToken={updateToken} /></ProtectedRoute>} />
          <Route path="/login" element={<Login updateToken={updateToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404 – Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

// کامپوننت برای محافظت از مسیرها
function ProtectedRoute({ token, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);
  return token ? children : null;
}

export default App;