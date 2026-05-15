import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token cache mechanism (30 mins expiration)
  useEffect(() => {
    const cachedData = localStorage.getItem('apex_auth');
    if (cachedData) {
      const { user: cachedUser, expiresAt } = JSON.parse(cachedData);
      if (new Date().getTime() < expiresAt) {
        setUser(cachedUser);
        const newExpiresAt = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem('apex_auth', JSON.stringify({ user: cachedUser, expiresAt: newExpiresAt }));
      } else {
        localStorage.removeItem('apex_auth');
      }
    }
    setLoading(false);
  }, []);

  // Activity listener to refresh token
  useEffect(() => {
    const refreshCache = () => {
      if (user) {
        const expiresAt = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem('apex_auth', JSON.stringify({ user, expiresAt }));
      }
    };
    
    window.addEventListener('mousemove', refreshCache);
    window.addEventListener('keydown', refreshCache);
    
    return () => {
      window.removeEventListener('mousemove', refreshCache);
      window.removeEventListener('keydown', refreshCache);
    };
  }, [user]);

  const login = (role, existingUser = null) => {
    let newUser = existingUser;
    if (!newUser) {
      newUser = {
        id: role + '_' + Date.now(),
        name: role === 'admin' ? 'Admin User' : role === 'hr' ? 'HR Manager' : 'Christian Employee',
        email: role === 'admin' ? 'admin@apex.com' : role === 'hr' ? 'hr@apex.com' : 'employee@example.com',
        role: role,
        photoURL: 'https://ui-avatars.com/api/?name=' + (role === 'admin' ? 'Admin' : role === 'hr' ? 'HR' : 'Christian+Emp') + '&background=random',
        // Dummy profile data for employee
        title: 'React Developer',
        summary: 'Passionate frontend developer with 4 years of experience building scalable web applications using React and Tailwind.',
        experience: 'TechNova (2020-2023) - Frontend Engineer',
        settings: { newsletter: true, jobAlerts: true, hrUpdates: true }
      };
    }
    setUser(newUser);
    const expiresAt = new Date().getTime() + 30 * 60 * 1000;
    localStorage.setItem('apex_auth', JSON.stringify({ user: newUser, expiresAt }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apex_auth');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      const expiresAt = new Date().getTime() + 30 * 60 * 1000;
      localStorage.setItem('apex_auth', JSON.stringify({ user: updatedUser, expiresAt }));
      return updatedUser;
    });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
