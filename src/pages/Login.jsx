import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin' || role === 'hr') {
      navigate('/admin');
    } else {
      navigate('/employee/account');
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-space-blue">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <div className="space-y-6">
            <p className="text-sm text-gray-500 text-center mb-6">
              For demonstration purposes, please select a role to mock the "Sign in with Google" flow.
            </p>
            
            <button
              onClick={() => handleLogin('employee')}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <i className="bi bi-google text-red-500"></i> Sign in as Employee
            </button>

            {/* <button
              onClick={() => handleLogin('admin')}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <i className="bi bi-google text-red-500"></i> Sign in as Admin
            </button> */}

            {/* <button
              onClick={() => handleLogin('hr')}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <i className="bi bi-google text-red-500"></i> Sign in as HR Company User
            </button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
