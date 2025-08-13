import React, { useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          minLength="6"
          required
        />
        <button type="submit" className="auth-btn">
          Login
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: '500' }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default LoginPage;