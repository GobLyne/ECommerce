import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error(err.response.data);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error(err.response.data);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthToken(false);
  };

  const updateUser = async (userData) => {
    try {
      const res = await axios.put('/api/auth/update-profile', userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error(err.response.data);
      throw err;
    }
  };

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('/api/auth/user');
      setUser(res.data);
    } catch (err) {
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
