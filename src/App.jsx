import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Careers from './pages/public/Careers';
import News from './pages/public/News';
import Login from './pages/public/Login';
import DemoLogin from './pages/public/DemoLogin';
import AdminPortal from './pages/portals/admin/AdminPortal';
import HRPortal from './pages/portals/hr/HRPortal';

// NEW: Import Facebook-style EmployeePortal (no animations)
import EmployeePortal from './pages/portals/employee/EmployeeDashboard';

// Protected Route Component for Admin/HR
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Protected Route for Employees
const EmployeeRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'employee') {
    return <Navigate to="/login" />;
  }
  return children;
};

// Route Guard to redirect logged-in users away from Public/Login pages appropriately
const AuthGuard = ({ children, isLoginRoute = false }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    if (user.role === 'hr') {
      return <Navigate to="/hr" />;
    }
    if (user.role === 'employee') {
      return <Navigate to="/employee" />;
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
            <Route path="/login" element={<AuthGuard><PublicLayout><Login /></PublicLayout></AuthGuard>} />
            <Route path="/demo-login" element={<AuthGuard><PublicLayout><DemoLogin /></PublicLayout></AuthGuard>} />
            
            {/* NEW: Facebook-style Employee Portal (no animations, protected) */}
            <Route path="/employee/*" element={
              <EmployeeRoute>
                <EmployeePortal />
              </EmployeeRoute>
            } />

            {/* Admin & HR Routes (No public Navbar/Footer, relies on its own layout) */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            } />
            <Route path="/hr" element={
              <AdminRoute>
                <HRPortal />
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </MockDBProvider>
  );
}

export default App;
