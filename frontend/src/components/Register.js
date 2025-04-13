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

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('The password and password confirmation must be the same.');
      return;
    }

    try {
      const res = await fetch('https://module-5-u7b1.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Register failed');
      }

      setError('Register was successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const [hover, setHover] = useState(false);

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
          <h2 style={{ textAlign: 'center' }}>Register</h2>
          <TextField label="Name" value={name} onChange={(e, val) => setName(val)} required />
          <TextField label="Email" type="email" value={email} onChange={(e, val) => setEmail(val)} required />
          <TextField label="Password" type="password" value={password} onChange={(e, val) => setPassword(val)} required />
          <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e, val) => setConfirmPassword(val)} required />
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
            Register
          </button>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <a onClick={() => navigate('/login')} style={{ color: '#0078d4', cursor: 'pointer' }}>Already have an account? Log in</a>
          </div>
        </Stack>
      </form>
    </div>
  );
}

export default Register;
