import React, { useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={onChange}
          required
        />
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
          Register
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: '500' }}>Sign in here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;