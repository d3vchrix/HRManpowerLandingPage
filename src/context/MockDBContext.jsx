import { createContext, useState, useContext } from 'react';

const MockDBContext = createContext();
export const useDB = () => useContext(MockDBContext);

const DUMMY_JOBS = [
  { id: '1', role: 'Frontend Developer', industry: 'IT', location: 'Manila, Philippines', minSalary: 60000, maxSalary: 120000, company: 'TechNova', status: 'Active', description: 'Build responsive and modern web applications using React and Tailwind CSS.', questions: ['How many years of React experience do you have?', 'Provide a link to your portfolio.'] },
  { id: '2', role: 'Warehouse Manager', industry: 'Logistics', location: 'Cebu City', minSalary: 40000, maxSalary: 70000, company: 'GlobalLogistics', status: 'Active', description: 'Oversee daily operations of the warehouse, managing staff and inventory.', questions: ['Do you have experience managing teams of 20+?'] },
  { id: '3', role: 'Data Analyst', industry: 'Finance', location: 'Makati, Philippines', minSalary: 50000, maxSalary: 90000, company: 'FinanceCorp', status: 'Active', description: 'Analyze large datasets to extract actionable business insights.', questions: ['Rate your SQL proficiency from 1-10.'] },
  { id: '4', role: 'Backend Engineer', industry: 'IT', location: 'Quezon City', minSalary: 70000, maxSalary: 130000, company: 'CloudWorks', status: 'Active', description: 'Design and implement scalable APIs using Node.js and PostgreSQL.', questions: ['What is your experience with microservices?'] },
  { id: '5', role: 'Registered Nurse', industry: 'Healthcare', location: 'Davao City', minSalary: 35000, maxSalary: 60000, company: 'CareMed Hospital', status: 'Active', description: 'Provide high-quality patient care in a fast-paced hospital environment.', questions: ['Are you a PRC licensed nurse?', 'How many years of clinical experience do you have?'] },
  { id: '6', role: 'Civil Engineer', industry: 'Construction', location: 'BGC, Taguig', minSalary: 45000, maxSalary: 85000, company: 'BuildRite Inc.', status: 'Active', description: 'Manage site operations and ensure compliance with building codes and safety regulations.', questions: ['Are you a licensed civil engineer?', 'Have you managed high-rise projects?'] },
  { id: '7', role: 'Customer Support Representative', industry: 'BPO', location: 'Mandaluyong', minSalary: 25000, maxSalary: 40000, company: 'VoiceTech Solutions', status: 'Active', description: 'Handle inbound customer inquiries and resolve issues promptly.', questions: ['Are you willing to work on rotating night shifts?'] },
  { id: '8', role: 'Digital Marketing Specialist', industry: 'Marketing', location: 'Pasig City', minSalary: 30000, maxSalary: 55000, company: 'BrandBoost', status: 'Active', description: 'Develop and execute social media campaigns to drive brand awareness.', questions: ['What tools do you use for SEO tracking?'] },
  { id: '9', role: 'Accountant', industry: 'Finance', location: 'Makati, Philippines', minSalary: 40000, maxSalary: 75000, company: 'LedgerPro', status: 'Active', description: 'Manage corporate tax filings, payroll, and monthly financial reporting.', questions: ['Are you a Certified Public Accountant (CPA)?'] },
  { id: '10', role: 'HR Manager', industry: 'Human Resources', location: 'Manila, Philippines', minSalary: 50000, maxSalary: 95000, company: 'Apex Group', status: 'Active', description: 'Oversee recruitment, employee relations, and performance management.', questions: ['Describe your experience with HRIS platforms.'] },
  { id: '11', role: 'Delivery Driver', industry: 'Logistics', location: 'Caloocan', minSalary: 18000, maxSalary: 25000, company: 'SwiftDeliver', status: 'Active', description: 'Safely transport goods to various locations within Metro Manila.', questions: ['Do you have a professional drivers license (Restriction 2,3)?'] },
  { id: '12', role: 'UI/UX Designer', industry: 'IT', location: 'Remote', minSalary: 50000, maxSalary: 100000, company: 'CreativeMinds', status: 'Active', description: 'Create intuitive user interfaces and wireframes for web and mobile apps.', questions: ['Please provide a link to your Figma or Behance portfolio.'] },
  { id: '13', role: 'Sales Executive', industry: 'Retail', location: 'Alabang', minSalary: 25000, maxSalary: 45000, company: 'RetailMax', status: 'Active', description: 'Drive store sales and maintain excellent customer relationships.', questions: ['What is your strategy for upselling products?'] },
  { id: '14', role: 'Security Guard', industry: 'Security', location: 'Quezon City', minSalary: 16000, maxSalary: 22000, company: 'SafeShield Services', status: 'Active', description: 'Maintain secure premises by patrolling and monitoring surveillance equipment.', questions: ['Do you have an updated security license?'] },
  { id: '15', role: 'Data Scientist', industry: 'IT', location: 'BGC, Taguig', minSalary: 90000, maxSalary: 160000, company: 'AI Innovations', status: 'Active', description: 'Develop machine learning models to solve complex business problems.', questions: ['Explain your experience with Python and TensorFlow.'] }
];

export const MockDBProvider = ({ children }) => {
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 4000);
  };

  const applyForJob = (jobId, userId, applicationData) => {
    setApplications(prev => [...prev, { id: Date.now().toString(), jobId, userId, status: 'Under Review', appliedAt: new Date().toISOString(), ...applicationData }]);
    addAlert('Application submitted successfully!');
  };

  const saveJob = (jobId, userId) => {
    if (!savedJobs.find(sj => sj.jobId === jobId && sj.userId === userId)) {
      setSavedJobs(prev => [...prev, { jobId, userId, savedAt: new Date().toISOString() }]);
      addAlert('Job saved to your profile!');
    } else {
      addAlert('Job is already saved.', 'info');
    }
  };

  const unsaveJob = (jobId, userId) => {
    setSavedJobs(prev => prev.filter(sj => !(sj.jobId === jobId && sj.userId === userId)));
    addAlert('Job removed from saved!', 'info');
  };

  return (
    <MockDBContext.Provider value={{ jobs, applications, savedJobs, applyForJob, saveJob, unsaveJob, addAlert }}>
      {children}
      {/* Global Alert System */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`px-6 py-3 rounded-lg shadow-xl text-white font-semibold transition-all ${alert.type === 'success' ? 'bg-mint-green text-space-blue' : alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            {alert.message}
          </div>
        ))}
      </div>
    </MockDBContext.Provider>
  );
};
