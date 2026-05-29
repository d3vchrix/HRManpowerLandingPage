import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useDB } from '../../../context/MockDBContext';
import EmployeeAccountInfo from './EmployeeAccountInfo';
import EmployeeUploadResume from './EmployeeUploadResume';
import EmployeeRequirements from './EmployeeRequirements';
import EmployeeTrackJobs from './EmployeeTrackJobs';
import EmployeeSavedJobs from './EmployeeSavedJobs';
import EmployeeSettings from './EmployeeSettings';

// --- PROFILE CARD (Right Sidebar Widget) ---
// FIX: Removed 'sticky top-4' from the wrapper div
const ProfileCompletionWidget = ({ user }) => {
  const completionPercentage = 75; 
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-space-blue mb-4">Profile Completion</h3>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-mint-green" style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">{completionPercentage}% Complete</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><i className="bi bi-check-circle text-mint-green"></i> <span>Profile Photo</span></div>
        <div className="flex items-center gap-2"><i className="bi bi-check-circle text-mint-green"></i> <span>Personal Info</span></div>
        <div className="flex items-center gap-2"><i className="bi bi-circle text-gray-300"></i> <span>Work Experience</span></div>
      </div>
    </div>
  );
};

// --- QUICK ACTIONS WIDGET ---
// FIX: Removed 'sticky top-80' from the wrapper div
const QuickActionsWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-space-blue mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full bg-mint-green text-space-blue font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
          <i className="bi bi-briefcase"></i> Browse Jobs
        </button>
        <button className="w-full border-2 border-mint-green text-mint-green font-bold py-2 rounded-lg hover:bg-mint-green hover:text-space-blue transition-all flex items-center justify-center gap-2">
          <i className="bi bi-upload"></i> Upload Resume
        </button>
        <button className="w-full border-2 border-space-blue text-space-blue font-bold py-2 rounded-lg hover:bg-space-blue hover:text-white transition-all flex items-center justify-center gap-2">
          <i className="bi bi-chat-dots"></i> Get Support
        </button>
      </div>
    </div>
  );
};

// --- JOB STATS WIDGET ---
const JobStatsWidget = ({ user }) => {
  const { applications, savedJobs } = useDB();
  const appliedCount = applications.filter(a => a.userId === user.id).length;
  const savedCount = savedJobs.filter(s => s.userId === user.id).length;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-space-blue mb-4">Your Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-mint-green">{appliedCount}</p>
          <p className="text-xs text-gray-600">Applications</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-space-blue">{savedCount}</p>
          <p className="text-xs text-gray-600">Saved Jobs</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
const EmployeeDashboard = () => {
  const location = useLocation();
  const { user, updateProfile } = useAuth();
  const path = location.pathname.split('/').pop();

  if (!user) return <div className="text-center py-20">Please log in.</div>;

  const titles = {
    account: 'Account Information',
    resume: 'Resume Management',
    requirements: 'Check Requirements',
    jobs: 'Track Applications',
    saved: 'Saved Jobs',
    settings: 'Settings',
  };

  const renderContent = () => {
    switch (path) {
      case 'account':
        return <EmployeeAccountInfo user={user} updateProfile={updateProfile} />;
      case 'resume':
        return <EmployeeUploadResume user={user} />;
      case 'requirements':
        return <EmployeeRequirements />;
      case 'jobs':
        return <EmployeeTrackJobs user={user} />;
      case 'saved':
        return <EmployeeSavedJobs user={user} />;
      case 'settings':
        return <EmployeeSettings user={user} updateProfile={updateProfile} />;
      default:
        return <EmployeeAccountInfo user={user} updateProfile={updateProfile} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-light-gray min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* LEFT COLUMN - Navigation Sidebar */}
          <div className="md:col-span-1">
            {/* FIX: Changed top-4 to top-24 to clear the sticky navbar */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-b from-space-blue to-blue-700 text-white p-6 text-center">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto border-4 border-mint-green mb-3 object-cover"
                />
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-mint-green text-sm font-semibold">{user.title || 'Employee'}</p>
              </div>

              <nav className="p-4 space-y-2">
                {[
                  ['account', 'bi-person', 'Profile'],
                  ['resume', 'bi-file-earmark-text', 'Resume'],
                  ['requirements', 'bi-list-check', 'Requirements'],
                  ['jobs', 'bi-briefcase', 'Applications'],
                  ['saved', 'bi-bookmark', 'Saved Jobs'],
                  ['settings', 'bi-gear', 'Settings'],
                ].map(([routePath, icon, label]) => (
                  <Link
                    key={routePath}
                    to={`/employee/${routePath}`}
                    className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all font-semibold text-sm ${
                      path === routePath
                        ? 'bg-mint-green text-space-blue shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`bi ${icon}`}></i> {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* CENTER COLUMN - Main Content */}
          <div className="md:col-span-2">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 md:p-8"
            >
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h2 className="text-3xl font-bold text-space-blue">{titles[path] || 'Dashboard'}</h2>
                <p className="text-gray-600 text-sm mt-2">Manage your profile and job applications</p>
              </div>
              <div className="space-y-6">{renderContent()}</div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Widgets Sidebar */}
          {/* FIX: Wrapped widgets in a single sticky column container with gap/spacing */}
          <div className="md:col-span-3 lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4 md:gap-6">
              <ProfileCompletionWidget user={user} />
              <JobStatsWidget user={user} />
              <QuickActionsWidget />
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;