// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    user: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (authState.token) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: { 'x-auth-token': authState.token },
          });
          setAuthState((prevState) => ({ ...prevState, user: res.data }));
        } catch (err) {
          console.error(err);
          logout();
        }
      }
    };

    fetchUser();
  }, [authState.token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthState({ ...authState, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
