import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed in name')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await fetch('https://module-5-u7b1.onrender.com/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Register failed');
        }

        setServerError('');
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setServerError(`Error: ${err.message}`);
        setIsSuccess(false);
      }
    },
  });

  return (
    <Background>
      <StyledForm onSubmit={formik.handleSubmit}>
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
          <h2 style={{ textAlign: 'center' }}>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {formik.touched.name && formik.errors.name && (
            <MessageBar messageBarType={MessageBarType.error}>{formik.errors.name}</MessageBar>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {formik.touched.email && formik.errors.email && (
            <MessageBar messageBarType={MessageBarType.error}>{formik.errors.email}</MessageBar>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {formik.touched.password && formik.errors.password && (
            <MessageBar messageBarType={MessageBarType.error}>{formik.errors.password}</MessageBar>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <MessageBar messageBarType={MessageBarType.error}>{formik.errors.confirmPassword}</MessageBar>
          )}

          {serverError && (
            <MessageBar messageBarType={MessageBarType.error}>{serverError}</MessageBar>
          )}
          {isSuccess && (
            <MessageBar messageBarType={MessageBarType.success}>
              Register was successful! Redirecting to login...
            </MessageBar>
          )}

          <StyledButton type="submit">Register</StyledButton>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <StyledLink onClick={() => navigate('/login')}>
              Already have an account? Log in.
            </StyledLink>
          </div>
        </Stack>
      </StyledForm>
    </Background>
  );
}

export default Register;
