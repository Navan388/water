import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem('token'),
  });

  // ✅ Login: update context and localStorage
  const login = (userData, token) => {
    setAuth({ user: userData, token });
    localStorage.setItem('token', token);
  };

  // ✅ Logout: clear context and localStorage
  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
