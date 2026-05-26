import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin' || role === 'hr') {
      navigate('/admin');
    } else {
      navigate('/employee/account');
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      handleLogin('employee');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center md:pr-8"
          >
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-black text-space-blue mb-4">
                Apex
              </h1>
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-mint-green to-space-blue bg-clip-text text-transparent">
                Manpower
              </h2>
            </div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Connect with your next opportunity. Join thousands of professionals finding their perfect role.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-briefcase text-2xl text-mint-green"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-space-blue">Find Your Dream Job</h3>
                  <p className="text-gray-600 text-sm">Browse hundreds of job opportunities tailored to your skills.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-person-check text-2xl text-mint-green"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-space-blue">Showcase Your Profile</h3>
                  <p className="text-gray-600 text-sm">Create a professional profile that stands out to employers.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-rocket-takeoff text-2xl text-mint-green"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-space-blue">Quick Applications</h3>
                  <p className="text-gray-600 text-sm">Apply to jobs instantly with your complete profile.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form (Facebook Style) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl font-bold text-space-blue mb-2">Sign In</h2>
            <p className="text-gray-500 mb-8 text-sm">Welcome back! Sign in to continue.</p>

            <form onSubmit={handleEmailLogin} className="space-y-6 mb-8">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-light-gray rounded-lg border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-light-gray rounded-lg border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-mint-green" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-mint-green hover:text-space-blue font-semibold transition-colors">Forgot password?</a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-mint-green to-mint-green hover:shadow-lg hover:opacity-90 text-space-blue font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <i className="bi bi-box-arrow-in-right"></i> Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social & Quick Access Buttons */}
            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={() => handleLogin('employee')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-space-blue text-space-blue hover:bg-space-blue hover:text-white font-bold rounded-lg transition-all duration-300"
              >
                <i className="bi bi-google"></i> Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleLogin('employee')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-space-blue text-space-blue hover:bg-space-blue hover:text-white font-bold rounded-lg transition-all duration-300"
              >
                <i className="bi bi-envelope"></i> Login as Employee
              </button>
              <button
                type="button"
                onClick={() => handleLogin('hr')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-space-blue text-white hover:shadow-lg hover:opacity-90 font-bold rounded-lg transition-all duration-300"
              >
                <i className="bi bi-shield-check"></i> Login as HR Manager
              </button>

              <button
                type="button"
                onClick={() => handleLogin('admin')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-mint-green text-space-blue hover:shadow-lg hover:opacity-90 font-bold rounded-lg transition-all duration-300"
              >
                <i className="bi bi-lock"></i> Login as Admin
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-mint-green hover:text-space-blue font-bold transition-colors">
                  Create one now
                </a>
              </p>
            </div>

            {/* Demo Login Link */}
            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/demo-login')}
                className="text-gray-500 hover:text-mint-green text-sm font-semibold transition-colors"
              >
                <i className="bi bi-play-circle mr-1"></i> Try Demo Login
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
