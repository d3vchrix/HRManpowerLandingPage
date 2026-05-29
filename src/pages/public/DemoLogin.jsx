import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DemoLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'hr') {
      navigate('/hr');
    } else {
      navigate('/employee/account');
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-space-blue mb-4">
            Demo Login
          </h1>
          <p className="text-xl text-gray-600">
            Choose a role to test the system
          </p>
        </motion.div>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => handleDemoLogin('employee')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-t-4 border-mint-green"
          >
            <div className="text-center">
              <i className="bi bi-person-circle text-6xl text-mint-green mb-4 block"></i>
              <h2 className="text-2xl font-bold text-space-blue mb-3">Employee Portal</h2>
              <p className="text-gray-600 text-sm mb-6">
                Browse jobs, manage applications, and showcase your profile
              </p>
              <button className="w-full bg-mint-green text-space-blue font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                Demo as Employee
              </button>
            </div>
          </motion.div>

          {/* HR Manager Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => handleDemoLogin('hr')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-t-4 border-space-blue"
          >
            <div className="text-center">
              <i className="bi bi-shield-check text-6xl text-space-blue mb-4 block"></i>
              <h2 className="text-2xl font-bold text-space-blue mb-3">HR Manager Portal</h2>
              <p className="text-gray-600 text-sm mb-6">
                Approve jobs, manage applications, and handle HR operations
              </p>
              <button className="w-full bg-space-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                Demo as HR Manager
              </button>
            </div>
          </motion.div>

          {/* Admin Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => handleDemoLogin('admin')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-t-4 border-red-500"
          >
            <div className="text-center">
              <i className="bi bi-lock text-6xl text-red-500 mb-4 block"></i>
              <h2 className="text-2xl font-bold text-space-blue mb-3">Admin Portal</h2>
              <p className="text-gray-600 text-sm mb-6">
                System administration, user management, and full control
              </p>
              <button className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                Demo as Admin
              </button>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/login')}
            className="text-mint-green hover:text-space-blue font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <i className="bi bi-arrow-left"></i> Back to Login
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoLogin;
