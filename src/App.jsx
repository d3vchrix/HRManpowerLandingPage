import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Careers from './pages/Careers';
import News from './pages/News';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

import EmployeeDashboard from './pages/EmployeeDashboard';

// Protected Route Component for Admin/HR
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Route Guard to redirect logged-in users away from Public/Login pages appropriately
const AuthGuard = ({ children, isLoginRoute = false }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin' || user.role === 'hr') {
      return <Navigate to="/admin" />;
    }
    if (isLoginRoute && user.role === 'employee') {
      return <Navigate to="/employee/account" />;
    }
  }
  return children;
};

// Layout for Public / Employee (shows standard Navbar and Footer)
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

import { MockDBProvider } from './context/MockDBContext';

function App() {
  return (
    <MockDBProvider>
      <AuthProvider>
        <Router basename="/HRManpowerLandingPage">
          <Routes>
            {/* Public & Employee Routes */}
            <Route path="/" element={<AuthGuard><PublicLayout><Home /></PublicLayout></AuthGuard>} />
            <Route path="/about" element={<AuthGuard><PublicLayout><About /></PublicLayout></AuthGuard>} />
            <Route path="/careers/*" element={<AuthGuard><PublicLayout><Careers /></PublicLayout></AuthGuard>} />
            <Route path="/news" element={<AuthGuard><PublicLayout><News /></PublicLayout></AuthGuard>} />
            <Route path="/login" element={<AuthGuard isLoginRoute><PublicLayout><Login /></PublicLayout></AuthGuard>} />
            
            {/* Employee Dropdown Routes */}
            <Route path="/employee/*" element={<PublicLayout><EmployeeDashboard /></PublicLayout>} />

            {/* Admin & HR Routes (No public Navbar/Footer, relies on its own layout) */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </MockDBProvider>
  );
}

export default App;
