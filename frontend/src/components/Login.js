import React, { useState } from 'react';
import { TextField, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
  backgroundColor: '#0078d4',
  color: '#ffffff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
};

const buttonHover = {
  backgroundColor: '#106ebe',
};

const buttonActive = {
  backgroundColor: 'yellow',
  color: '#0078d4',
};

function Login({ updateToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json();
      updateToken(data.token);
      navigate('/');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f3f2f1'
    }}>
      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 15 }} styles={{ root: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
          <h2 style={{ textAlign: 'center' }}>Login</h2>
          <TextField label="Email" type="email" value={email} onChange={(e, val) => setEmail(val)} required />
          <TextField label="Password" type="password" value={password} onChange={(e, val) => setPassword(val)} required />
          {error && (
            <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
              {error}
            </MessageBar>
          )}
          <button
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            style={{
              ...buttonStyle,
              ...(hover ? buttonHover : {}),
              ...(isActive ? buttonActive : {}),
            }}
          >
            Login
          </button>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <a onClick={() => navigate('/register')} style={{ color: '#0078d4', cursor: 'pointer' }}>Don't have an account yet? Sign up.</a>
          </div>
        </Stack>
      </form>
    </div>
  );
}

export default Login;
