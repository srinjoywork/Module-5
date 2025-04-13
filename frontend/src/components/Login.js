import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { TextField, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';

// 🔵 Background Gradient Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 💫 Styled Components
const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(-45deg, #0078d4, #00bcd4, #5e35b1, #ff4081);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled.form``;

const StyledButton = styled.button`
  background-color: #0078d4;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #106ebe;
  }

  &:active {
    background-color: yellow;
    color: #0078d4;
  }
`;

const StyledLink = styled.a`
  color: #0078d4;
  cursor: pointer;
`;

function Login({ updateToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Fill in all fields');
      return;
    }

    try {
      const res = await fetch('https://module-5-u7b1.onrender.com/auth/login', {
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
    <Background>
      <StyledForm onSubmit={handleSubmit}>
        <Stack
          tokens={{ childrenGap: 15 }}
          styles={{
            root: {
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          }}
        >
          <h2 style={{ textAlign: 'center' }}>Login</h2>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e, val) => setEmail(val)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e, val) => setPassword(val)}
            required
          />
          {error && (
            <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
              {error}
            </MessageBar>
          )}
          <StyledButton type="submit">Login</StyledButton>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <StyledLink onClick={() => navigate('/register')}>
              Don't have an account yet? Sign up.
            </StyledLink>
          </div>
        </Stack>
      </StyledForm>
    </Background>
  );
}

export default Login;
