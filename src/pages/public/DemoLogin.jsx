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
      navigate('/');
    }
  };

  const roles = [
    {
      id: 'employee',
      title: 'Employee',
      subtitle: 'Job Seeker Portal',
      icon: 'bi-briefcase',
      color: 'mint-green',
      borderColor: 'border-mint-green',
      bgColor: 'bg-green-50',
      badge: 'Explore',
      description: 'Find your perfect job match',
      features: [
        'Browse & apply to job listings',
        'Manage your applications',
        'Upload & manage resume',
        'Complete your profile',
        'Save favorite jobs'
      ]
    },
    {
      id: 'hr',
      title: 'HR Manager',
      subtitle: 'Hiring & Recruitment',
      icon: 'bi-people',
      color: 'space-blue',
      borderColor: 'border-space-blue',
      bgColor: 'bg-blue-50',
      badge: 'Manage',
      description: 'Handle recruitment operations',
      features: [
        'Approve job postings',
        'Review applications',
        'Send interview invitations',
        'Manage applicant workflow',
        'Generate HR reports'
      ]
    },
    {
      id: 'admin',
      title: 'Administrator',
      subtitle: 'System Control',
      icon: 'bi-shield-lock',
      color: 'red-500',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      badge: 'Control',
      description: 'Full system administration',
      features: [
        'User account management',
        'System configuration',
        'View all platform data',
        'Send bulk emails',
        'Generate system reports'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-space-blue mb-4">
            Choose Your Role
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore Apex Manpower with different user roles. Each portal has unique features and capabilities designed for different user types.
          </p>
        </motion.div>

        {/* Demo Login Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => handleDemoLogin(role.id)}
              className={`${role.bgColor} rounded-2xl shadow-lg hover:shadow-2xl border-l-4 ${role.borderColor} cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden group`}
            >
              {/* Header with Badge */}
              <div className={`bg-gradient-to-r from-${role.color} to-opacity-80 p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <i className={`bi ${role.icon} text-9xl`}></i>
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-space-blue mb-1">{role.title}</h2>
                    <p className="text-sm text-gray-600">{role.subtitle}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white text-${role.color} whitespace-nowrap`}>
                    {role.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 font-semibold mb-4">{role.description}</p>
                
                {/* Features List */}
                <div className="mb-6 space-y-2">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <i className={`bi bi-check-circle text-${role.color} font-bold text-sm mt-0.5 flex-shrink-0`}></i>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-${role.color} text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3`}
                >
                  <span>Enter as {role.title}</span>
                  <i className="bi bi-arrow-right transition-all"></i>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-mint-green bg-opacity-10 border-2 border-mint-green rounded-xl p-6 md:p-8 mb-8"
        >
          <div className="flex gap-4">
            <i className="bi bi-info-circle text-mint-green text-2xl flex-shrink-0 mt-1"></i>
            <div>
              <h3 className="text-lg font-bold text-space-blue mb-2">Demo Information</h3>
              <p className="text-gray-700">
                All demo accounts are pre-populated with sample data. Your profile updates will be saved during this session. 
                Each role has access to different features and dashboards tailored to their responsibilities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-mint-green hover:text-space-blue font-bold transition-colors text-lg"
          >
            <i className="bi bi-arrow-left"></i> Back to Login
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoLogin;
