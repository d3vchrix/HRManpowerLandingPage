import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useDB } from '../../../context/MockDBContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminCompanyProfiles from './AdminCompanyProfiles';
import AdminJobApprovals from './AdminJobApprovals';
import AdminUserManagement from './AdminUserManagement';
import AdminTickets from './AdminTickets';

// --- SHARED UI COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><i className="bi bi-x-lg text-xl"></i></button>
          <h2 className="text-xl sm:text-2xl font-bold text-space-blue mb-6 border-b pb-4 pr-6">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-500 gap-4">
    <span>Showing page {currentPage} of {totalPages}</span>
    <div className="space-x-1 flex flex-wrap justify-center gap-y-2">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-50">&lt;</button>
      {[...Array(Math.max(1, totalPages))].map((_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-mint-green text-space-blue font-bold' : 'hover:bg-gray-50'}`}>{i + 1}</button>
      ))}
      <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(currentPage + 1)} className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-50">&gt;</button>
    </div>
  </div>
);


// --- EMAIL COMPOSER ---

const HREmailComposer = () => {
  const { addAlert } = useDB();
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Interview Invitation', subject: 'Interview Invitation: Apex Manpower', message: 'Dear Applicant,\n\nWe would like to invite you for an interview...' },
    { id: 2, name: 'Rejection Notice', subject: 'Update on your Application', message: 'Dear Applicant,\n\nThank you for applying. Unfortunately...' },
    { id: 3, name: 'Account Suspension', subject: 'Account Suspension Notice', message: 'Your account has been suspended due to policy violations.' }
  ]);
  const [formData, setFormData] = useState({ to: '', replyTo: 'noreply@apexmanpower.com', cc: '', bcc: '', subject: '', message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    addAlert('Email sent successfully via Apex Mailer!', 'success');
    setFormData({ ...formData, subject: '', message: '', to: '' });
  };

  const handleTemplateClick = (t) => {
    setFormData({ ...formData, subject: t.subject, message: t.message });
    addAlert(`Applied Template: ${t.name}`, 'info');
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    const tName = e.target.tName.value;
    const tSubj = e.target.tSubj.value;
    const tMsg = e.target.tMsg.value;
    
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, name: tName, subject: tSubj, message: tMsg } : t));
      addAlert('Template updated successfully.', 'success');
    } else {
      setTemplates([...templates, { id: Date.now(), name: tName, subject: tSubj, message: tMsg }]);
      addAlert('New template created.', 'success');
    }
    setIsModalOpen(false);
  };

  const deleteTemplate = (id, e) => {
    e.stopPropagation();
    setTemplates(templates.filter(t => t.id !== id));
    addAlert('Template deleted.', 'success');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="flex-grow bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-3 sm:pb-4">Email Composer</h3>
        <form onSubmit={handleSend} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">To</label><input type="email" required value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} className="w-full border-gray-300 rounded-lg px-3 py-2 border text-sm" placeholder="applicant@example.com" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Reply-To</label><input type="email" value={formData.replyTo} onChange={e => setFormData({...formData, replyTo: e.target.value})} className="w-full border-gray-300 rounded-lg px-3 py-2 border text-sm" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Subject</label><input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border-gray-300 rounded-lg px-3 py-2 border text-sm font-semibold" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Message</label><textarea rows="6" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border-gray-300 rounded-lg px-3 py-2 border text-sm"></textarea></div>
          <button type="submit" className="bg-mint-green text-space-blue px-6 sm:px-8 py-2 rounded-lg font-bold hover:bg-opacity-90 text-sm sm:text-base w-full sm:w-auto"><i className="bi bi-send mr-2"></i> Send Email</button>
        </form>
      </div>

      <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-space-blue mb-3 sm:mb-4">Email Templates</h4>
          <ul className="space-y-2 sm:space-y-3">
            {templates.map(t => (
              <li key={t.id} onClick={() => handleTemplateClick(t)} className="p-2 sm:p-3 bg-gray-50 hover:bg-mint-green hover:text-space-blue cursor-pointer rounded-lg text-xs sm:text-sm transition-colors border border-gray-200 relative group">
                <span className="font-semibold block pr-8">{t.name}</span>
                <span className="text-xs text-gray-500 truncate block mt-1">{t.subject}</span>
                <div className="absolute top-2 right-2 flex gap-2 sm:hidden group-hover:flex">
                  <button onClick={(e) => { e.stopPropagation(); setEditingTemplate(t); setIsModalOpen(true); }} className="text-blue-500 text-sm p-1"><i className="bi bi-pencil-square"></i></button>
                  <button onClick={(e) => deleteTemplate(t.id, e)} className="text-red-500 text-sm p-1"><i className="bi bi-trash"></i></button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }} className="mt-3 sm:mt-4 w-full border-2 border-dashed border-gray-300 py-2 rounded-lg text-gray-500 text-xs sm:text-sm hover:border-mint-green hover:text-mint-green transition-colors">+ Create Template</button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTemplate ? "Edit Template" : "New Template"}>
        <form onSubmit={handleSaveTemplate} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label><input name="tName" required defaultValue={editingTemplate?.name} className="w-full border-gray-300 rounded border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label><input name="tSubj" required defaultValue={editingTemplate?.subject} className="w-full border-gray-300 rounded border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label><textarea name="tMsg" rows="5" required defaultValue={editingTemplate?.message} className="w-full border-gray-300 rounded border px-3 py-2"></textarea></div>
          <button type="submit" className="bg-space-blue text-white w-full py-2 rounded-lg font-bold">Save Template</button>
        </form>
      </Modal>
    </div>
  );
};


// --- REPORTS VIEWS ---

const ReportsView = ({ isHR }) => {
  const { addAlert } = useDB();
  const [dateRange, setDateRange] = useState({ from: '2023-01-01', to: '2023-12-31' });

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-space-blue">{isHR ? 'HR Reports' : 'Admin System Reports'}</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm w-full md:w-auto">
          <label className="font-semibold text-gray-600">Coverage:</label>
          <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} className="border rounded px-2 py-1 flex-1 min-w-[120px]" />
          <span>to</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} className="border rounded px-2 py-1 flex-1 min-w-[120px]" />
        </div>
      </div>
      
      {isHR && (
        <div className="mb-8 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2">Generate PDF List of Applicants</label>
            <select className="w-full border-gray-300 rounded-lg px-4 py-2 border text-sm">
              <option>All Job Posts</option>
              <option>UI/UX Designer</option>
              <option>Frontend Developer</option>
            </select>
          </div>
          <button onClick={() => addAlert('PDF Generated successfully!', 'success')} className="bg-mint-green text-space-blue px-6 py-2 rounded-lg font-bold w-full sm:w-auto flex-shrink-0 h-[42px] flex items-center justify-center"><i className="bi bi-file-earmark-pdf mr-2"></i>Generate PDF</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="border border-gray-200 p-4 sm:p-6 rounded-xl">
          <h4 className="font-bold text-space-blue mb-4 text-sm sm:text-base"><i className="bi bi-graph-up-arrow text-mint-green mr-2"></i> {isHR ? 'Applicant Volume (MoM)' : 'Platform Growth (MoM)'}</h4>
          <div className="flex items-end gap-1 sm:gap-2 h-40 mt-4 border-b border-l border-gray-300 p-2 relative">
            <div className="w-1/4 bg-blue-200 h-[30%] hover:bg-blue-400 transition-colors relative group"><span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs hidden group-hover:block">Q1</span></div>
            <div className="w-1/4 bg-blue-300 h-[50%] hover:bg-blue-500 transition-colors relative group"><span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs hidden group-hover:block">Q2</span></div>
            <div className="w-1/4 bg-blue-400 h-[70%] hover:bg-blue-600 transition-colors relative group"><span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs hidden group-hover:block">Q3</span></div>
            <div className="w-1/4 bg-mint-green h-[90%] hover:bg-green-500 transition-colors relative group"><span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs hidden group-hover:block">Q4</span></div>
          </div>
        </div>

        <div className="border border-gray-200 p-4 sm:p-6 rounded-xl overflow-x-auto">
          <h4 className="font-bold text-space-blue mb-4 text-sm sm:text-base"><i className="bi bi-trophy text-yellow-500 mr-2"></i> {isHR ? 'Hiring Success Rate' : 'Placement Success Rate'}</h4>
          <table className="w-full text-xs sm:text-sm text-left mt-4 whitespace-nowrap">
            <thead>
              <tr className="border-b text-gray-500"><th className="pb-2">Metric</th><th className="pb-2">Value</th><th className="pb-2">Trend</th></tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2 pr-4">Total Placements</td><td className="py-2 font-bold text-space-blue pr-4">1,204</td><td className="py-2 text-green-500"><i className="bi bi-arrow-up"></i> 12%</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">Time-to-Hire</td><td className="py-2 font-bold text-space-blue pr-4">14 Days</td><td className="py-2 text-green-500"><i className="bi bi-arrow-down"></i> 2 Days</td></tr>
              <tr><td className="py-2 pr-4">Offer Acceptance</td><td className="py-2 font-bold text-space-blue pr-4">89%</td><td className="py-2 text-yellow-500"><i className="bi bi-dash"></i> 0%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// --- HR SPECIFIC COMPONENTS ---

const HRDashboardHome = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border-l-4 border-mint-green">
        <h3 className="text-gray-500 font-medium text-sm sm:text-base">Total Applicants</h3><p className="text-2xl sm:text-3xl font-bold text-space-blue mt-2">156</p>
      </div>
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
        <h3 className="text-gray-500 font-medium text-sm sm:text-base">Active Job Posts</h3><p className="text-2xl sm:text-3xl font-bold text-space-blue mt-2">12</p>
      </div>
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border-l-4 border-yellow-500 sm:col-span-2 md:col-span-1">
        <h3 className="text-gray-500 font-medium text-sm sm:text-base">Pending Interviews</h3><p className="text-2xl sm:text-3xl font-bold text-space-blue mt-2">8</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
        <h4 className="font-bold text-space-blue mb-4">Application Trends (7 Days)</h4>
        <div className="h-40 sm:h-48 border-b border-l border-gray-300 flex items-end gap-1 sm:gap-2 p-1 sm:p-2 relative">
          <div className="w-1/7 bg-blue-300 h-[20%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[40%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[30%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[70%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[50%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[90%] flex-1 hover:bg-mint-green"></div>
          <div className="w-1/7 bg-blue-300 h-[100%] flex-1 hover:bg-mint-green"></div>
        </div>
      </div>
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
        <h4 className="font-bold text-space-blue mb-4">Pipeline Conversion</h4>
        <div className="space-y-4">
          <div><div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Applied</span><span>100%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-300 h-2 rounded-full w-full"></div></div></div>
          <div><div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Interviewed</span><span>45%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-[45%]"></div></div></div>
          <div><div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Hired</span><span>12%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-mint-green h-2 rounded-full w-[12%]"></div></div></div>
        </div>
      </div>
    </div>
  </>
);

const HRCompanyProfile = () => {
  const { addAlert } = useDB();
  const [showGoal, setShowGoal] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [ratesPage, setRatesPage] = useState(1);

  const mockRates = [
    { id: 1, user: 'Anon Employee', rating: 5, comment: 'Great place to work!', date: 'Oct 12' },
    { id: 2, user: 'John Doe', rating: 4, comment: 'Good benefits.', date: 'Oct 10' },
    { id: 3, user: 'Anon Employee', rating: 5, comment: 'Excellent culture.', date: 'Oct 05' },
  ];
  const pagedRates = mockRates.slice((ratesPage - 1) * 2, ratesPage * 2);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addAlert('File exceeds 5MB limit.', 'error'); return; }
    if (!['image/jpeg', 'image/png'].includes(file.type)) { addAlert('Only JPEG/PNG accepted.', 'error'); return; }
    setLogoPreview(URL.createObjectURL(file));
    addAlert('Logo uploaded successfully.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Goal Notification */}
      <AnimatePresence>
        {showGoal && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 flex justify-between items-start sm:items-center shadow-sm gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <i className="bi bi-trophy text-yellow-500 text-2xl mt-1 sm:mt-0"></i>
              <div>
                <h4 className="font-bold text-yellow-800">Goal: Reach #1 Top Employer!</h4>
                <p className="text-xs sm:text-sm text-yellow-700">Complete 3 more successful hires to earn the Top Employer Badge.</p>
              </div>
            </div>
            <button onClick={() => setShowGoal(false)} className="text-yellow-600 hover:text-yellow-800 shrink-0"><i className="bi bi-x-lg"></i></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-6 border-b pb-4">Company Profile</h3>
          
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative shrink-0">
              {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" /> : <i className="bi bi-image text-gray-400 text-2xl"></i>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">Company Logo</label>
              <input type="file" onChange={handleLogoUpload} accept="image/jpeg, image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mint-green file:text-space-blue hover:file:bg-opacity-80 cursor-pointer" />
              <p className="text-xs text-gray-400 mt-2">Accepts .JPEG, .PNG. Max size: 5MB.</p>
            </div>
          </div>

          <form onSubmit={e => { e.preventDefault(); addAlert('Profile updated.', 'success'); }} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Company Name</label><input type="text" defaultValue="TechNova Inc." className="w-full border rounded-lg px-4 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">About</label><textarea rows="4" className="w-full border rounded-lg px-4 py-2" defaultValue="A leading tech company..."></textarea></div>
            <button type="submit" className="bg-space-blue text-white w-full sm:w-auto px-6 py-2 rounded-lg font-bold">Save Profile</button>
          </form>
        </div>

        {/* Company Rates side panel */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4 gap-4">
            <h3 className="text-lg sm:text-xl font-bold text-space-blue">Employee Rates</h3>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <span className="text-xs font-bold text-gray-500">{isPublic ? 'Public' : 'Hidden'}</span>
              <input type="checkbox" checked={isPublic} onChange={e => { setIsPublic(e.target.checked); addAlert(e.target.checked ? 'Rates are now public.' : 'Rates hidden.', 'info'); }} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mint-green relative"></div>
            </label>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-bold text-space-blue">4.8</div>
            <div className="text-yellow-400 flex text-lg">
              <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-half"></i>
            </div>
          </div>

          <ul className="space-y-4 mb-4">
            {pagedRates.map(r => (
              <li key={r.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-space-blue">{r.user}</span>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <div className="text-yellow-400 text-xs mb-1"><i className="bi bi-star-fill"></i> {r.rating}/5</div>
                <p className="text-xs text-gray-600">"{r.comment}"</p>
              </li>
            ))}
          </ul>
          <Pagination currentPage={ratesPage} totalPages={Math.ceil(mockRates.length / 2)} onPageChange={setRatesPage} />
        </div>
      </div>
    </div>
  );
};

const HREmployeeApplications = () => (
  <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-4">Employee Applications</h3>
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full text-left border-collapse">
          <thead><tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase border-b"><th className="p-3 sm:p-4 whitespace-nowrap">Applicant</th><th className="p-3 sm:p-4 whitespace-nowrap">Applied For</th><th className="p-3 sm:p-4 whitespace-nowrap">Status</th><th className="p-3 sm:p-4 text-center whitespace-nowrap">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr><td className="p-3 sm:p-4 font-bold text-space-blue whitespace-nowrap">Alice Smith</td><td className="p-3 sm:p-4 whitespace-nowrap">UI/UX Designer</td><td className="p-3 sm:p-4 whitespace-nowrap"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Under Review</span></td><td className="p-3 sm:p-4 text-center whitespace-nowrap"><button className="bg-space-blue text-white px-3 py-1 rounded text-xs">View Profile</button></td></tr>
            <tr><td className="p-3 sm:p-4 font-bold text-space-blue whitespace-nowrap">Bob Jones</td><td className="p-3 sm:p-4 whitespace-nowrap">Frontend Developer</td><td className="p-3 sm:p-4 whitespace-nowrap"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Interviewed</span></td><td className="p-3 sm:p-4 text-center whitespace-nowrap"><button className="bg-space-blue text-white px-3 py-1 rounded text-xs">View Profile</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
  </div>
);

const HREmployeeManagement = () => (
  <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-4">Employee Management (Hired)</h3>
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full text-left border-collapse">
          <thead><tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase border-b"><th className="p-3 sm:p-4 whitespace-nowrap">Employee</th><th className="p-3 sm:p-4 whitespace-nowrap">Role</th><th className="p-3 sm:p-4 whitespace-nowrap">Hired Date</th><th className="p-3 sm:p-4 text-center whitespace-nowrap">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr><td className="p-3 sm:p-4 font-bold text-space-blue whitespace-nowrap">Charlie Davis</td><td className="p-3 sm:p-4 whitespace-nowrap">Warehouse Manager</td><td className="p-3 sm:p-4 whitespace-nowrap">Sept 1, 2023</td><td className="p-3 sm:p-4 text-center whitespace-nowrap"><button className="bg-gray-200 hover:bg-gray-300 transition-colors px-3 py-1 rounded text-xs font-bold">201 File</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const HRQuestionsModule = () => {
  const [activeTab, setActiveTab] = useState('banks');
  const [page, setPage] = useState(1);
  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-space-blue">Questions Management</h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => setActiveTab('banks')} className={`px-4 py-2 flex-1 sm:flex-none rounded-lg font-bold text-sm text-center ${activeTab === 'banks' ? 'bg-space-blue text-white' : 'bg-gray-100 text-gray-600'}`}>Question Banks</button>
          <button onClick={() => setActiveTab('creator')} className={`px-4 py-2 flex-1 sm:flex-none rounded-lg font-bold text-sm text-center ${activeTab === 'creator' ? 'bg-space-blue text-white' : 'bg-gray-100 text-gray-600'}`}>Question Creator</button>
        </div>
      </div>

      {activeTab === 'banks' && (
        <div>
          <div className="mb-4"><input type="text" placeholder="Search templates..." className="border rounded-lg px-4 py-2 text-sm w-full sm:w-1/3" /></div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left border-collapse border">
                <thead><tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm border-b"><th className="p-3 sm:p-4 whitespace-nowrap">Template Name</th><th className="p-3 sm:p-4 whitespace-nowrap">Questions</th><th className="p-3 sm:p-4 text-center whitespace-nowrap">Actions</th></tr></thead>
                <tbody className="text-sm">
                  <tr className="border-b"><td className="p-3 sm:p-4 font-bold whitespace-nowrap">React Dev Exam</td><td className="p-3 sm:p-4 whitespace-nowrap">15 Questions</td><td className="p-3 sm:p-4 text-center whitespace-nowrap"><button className="text-blue-500 mx-2"><i className="bi bi-pencil"></i></button></td></tr>
                  <tr className="border-b"><td className="p-3 sm:p-4 font-bold whitespace-nowrap">UI/UX Screening</td><td className="p-3 sm:p-4 whitespace-nowrap">8 Questions</td><td className="p-3 sm:p-4 text-center whitespace-nowrap"><button className="text-blue-500 mx-2"><i className="bi bi-pencil"></i></button></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={page} totalPages={2} onPageChange={setPage} />
        </div>
      )}

      {activeTab === 'creator' && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
          <h4 className="font-bold text-space-blue mb-4">Create New Template</h4>
          <input type="text" placeholder="Template Title (e.g. Backend Dev Exam)" className="w-full border rounded-lg px-4 py-2 mb-4" />
          <textarea rows="4" placeholder="Enter Question 1" className="w-full border rounded-lg px-4 py-2 mb-4"></textarea>
          <button className="bg-mint-green text-space-blue px-6 py-2 rounded-lg font-bold w-full">+ Add Another Question</button>
          <button className="bg-space-blue text-white px-6 py-2 rounded-lg font-bold mt-4 w-full">Save Template</button>
        </div>
      )}
    </div>
  );
};

const HRHiringProcess = () => {
  const { addAlert } = useDB();
  const stages = ['Screening', 'Test', 'Interview', 'Requirements', 'Hired'];
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Alice Smith', role: 'UI/UX Designer', stage: 'Screening' },
    { id: 2, name: 'Bob Jones', role: 'Frontend Dev', stage: 'Test' },
    { id: 3, name: 'Eve Carter', role: 'Backend Dev', stage: 'Interview' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCand, setSelectedCand] = useState(null);

  const onDragStart = (e, id) => e.dataTransfer.setData('candId', id);
  const onDrop = (e, newStage) => {
    const id = e.dataTransfer.getData('candId');
    setCandidates(candidates.map(c => c.id == id ? { ...c, stage: newStage } : c));
    addAlert(`Candidate moved to ${newStage}`, 'info');
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    setModalOpen(false);
    addAlert(`Schedule set and email alert sent to ${selectedCand.name}!`, 'success');
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-4">Hiring Process (Drag & Drop)</h3>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 min-w-[900px] h-full">
          {stages.map(stage => (
            <div key={stage} onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, stage)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[400px]">
              <h4 className="font-bold text-space-blue text-center mb-4 border-b pb-2 text-sm uppercase">{stage}</h4>
              <div className="space-y-3">
                {candidates.filter(c => c.stage === stage).map(c => (
                  <div key={c.id} draggable onDragStart={e => onDragStart(e, c.id)} className="bg-white p-3 rounded shadow-sm cursor-grab active:cursor-grabbing border border-gray-200 hover:border-mint-green hover:shadow-md transition-all">
                    <p className="font-bold text-sm text-space-blue">{c.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{c.role}</p>
                    <button onClick={() => { setSelectedCand(c); setModalOpen(true); }} className="w-full bg-space-blue hover:bg-opacity-90 text-white text-xs py-1.5 rounded transition-colors">Schedule / Alert</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Schedule: ${selectedCand?.name}`}>
        <form onSubmit={handleSchedule} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Set Date & Time</label><input type="datetime-local" required className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Requirements / Notes</label><textarea rows="3" className="w-full border rounded px-3 py-2"></textarea></div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" defaultChecked className="rounded" /> Send email alert to candidate
          </label>
          <button type="submit" className="bg-space-blue text-white w-full py-2 rounded-lg font-bold">Confirm & Send Alert</button>
        </form>
      </Modal>
    </div>
  );
};

const HRJobPosts = ({ setViewData }) => {
  const { addAlert } = useDB();
  const [page, setPage] = useState(1);
  const posts = [
    { id: 1, title: 'UI/UX Designer', status: 'Active' },
    { id: 2, title: 'Frontend Developer', status: 'Pending Approval' }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    addAlert('Job Post created and sent for Admin Approval.', 'success');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-4">Manage Job Posts</h3>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
          <h4 className="font-bold text-space-blue mb-4">Create New Job Post</h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Job Title" required className="w-full border rounded-lg px-4 py-2" />
            <input type="text" placeholder="Location" required className="w-full border rounded-lg px-4 py-2" />
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="number" placeholder="Min Salary" required className="w-full sm:w-1/2 border rounded-lg px-4 py-2" />
              <input type="number" placeholder="Max Salary" required className="w-full sm:w-1/2 border rounded-lg px-4 py-2" />
            </div>
            <textarea rows="4" placeholder="Job Description" required className="w-full border rounded-lg px-4 py-2"></textarea>
            <button type="submit" className="bg-mint-green text-space-blue px-6 py-2 rounded-lg font-bold w-full">Submit for Approval</button>
          </form>
        </div>
      </div>
      
      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold text-space-blue mb-4 sm:mb-6 border-b pb-4">Your Posts</h3>
        <ul className="space-y-3 sm:space-y-4 flex-grow">
          {posts.map(p => (
            <li key={p.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow transition-shadow bg-gray-50">
              <div>
                <p className="font-bold text-space-blue text-sm sm:text-base">{p.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-bold inline-block mt-1 ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span>
              </div>
              <button onClick={() => setViewData({ type: 'hr-job-details', payload: p })} className="bg-space-blue hover:bg-opacity-90 transition-colors text-white text-xs sm:text-sm px-4 py-2 rounded-lg font-bold w-full sm:w-auto">View</button>
            </li>
          ))}
        </ul>
        <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
      </div>
    </div>
  );
};

const HRJobDetailsPage = ({ job, goBack }) => (
  <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <button onClick={goBack} className="text-gray-500 hover:text-space-blue font-bold text-sm mb-4 sm:mb-6 flex items-center gap-2 transition-colors"><i className="bi bi-arrow-left"></i> Back to Posts</button>
    <h2 className="text-2xl sm:text-3xl font-bold text-space-blue">{job.title}</h2>
    <p className="text-sm font-bold text-gray-500 mb-6">Status: {job.status}</p>
    <div className="bg-gray-50 border border-gray-200 p-4 sm:p-6 rounded-xl">
      <h4 className="font-bold mb-4">Edit Mode (Mock)</h4>
      <p className="text-gray-500 text-sm">Full job editing interface goes here.</p>
    </div>
  </div>
);


// --- MAIN PORTAL COMPONENT ---

const AdminPortal = () => {
  const { user, logout } = useAuth();
  const { addAlert } = useDB();
  const navigate = useNavigate();
  
  const [activeMenu, setActiveMenu] = useState('home');
  const [viewData, setViewData] = useState(null); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [empMenuOpen, setEmpMenuOpen] = useState(false);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isHR = user?.role === 'hr';

  const notifications = isHR ? [
    { id: 1, text: "New application for UI/UX Designer", action: () => { setActiveMenu('emp-apps'); setShowNotifications(false); } }
  ] : [
    { id: 1, text: "UI/UX Designer pending approval", action: () => { setActiveMenu('jobs'); setShowNotifications(false); } }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToMenu = (menu) => {
    setViewData(null);
    setActiveMenu(menu);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  const SidebarItem = ({ id, icon, label, onClick }) => (
    <button onClick={onClick || (() => navigateToMenu(id))} className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${(!viewData && activeMenu === id) ? 'bg-mint-green text-space-blue font-bold border-r-4 border-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
      <span className="flex items-center gap-3"><i className={`bi ${icon} text-xl`}></i> {label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-light-gray overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-space-blue flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shrink-0`}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-mint-green flex items-center gap-2"><i className="bi bi-buildings"></i> Apex {isHR ? 'HR' : 'Admin'}</h2>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="flex-grow py-4 overflow-y-auto custom-scrollbar">
          {isHR ? (
            <>
              <SidebarItem id="home" icon="bi-house-door" label="Dashboard" />
              <SidebarItem id="company" icon="bi-building" label="Company Profile" />
              
              {/* Nested Dropdown for Employees */}
              <div className="flex flex-col">
                <button onClick={() => setEmpMenuOpen(!empMenuOpen)} className="w-full flex items-center justify-between px-6 py-4 text-gray-300 hover:bg-white hover:bg-opacity-10 transition-colors">
                  <span className="flex items-center gap-3"><i className="bi bi-people text-xl"></i> Employees</span>
                  <i className={`bi bi-chevron-${empMenuOpen ? 'up' : 'down'} text-xs`}></i>
                </button>
                <AnimatePresence>
                  {empMenuOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-gray-900 overflow-hidden">
                      <button onClick={() => navigateToMenu('emp-apps')} className={`w-full text-left pl-12 pr-6 py-3 text-sm transition-colors ${activeMenu === 'emp-apps' ? 'text-mint-green font-bold' : 'text-gray-400 hover:text-white'}`}>Applications</button>
                      <button onClick={() => navigateToMenu('emp-manage')} className={`w-full text-left pl-12 pr-6 py-3 text-sm transition-colors ${activeMenu === 'emp-manage' ? 'text-mint-green font-bold' : 'text-gray-400 hover:text-white'}`}>Management</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <SidebarItem id="questions" icon="bi-patch-question" label="Questions" />
              <SidebarItem id="hiring" icon="bi-calendar-check" label="Hiring Process" />
              <SidebarItem id="jobs" icon="bi-briefcase" label="Job Posts" />
              <SidebarItem id="email" icon="bi-envelope-paper" label="Email Composer" />
              <SidebarItem id="reports" icon="bi-file-earmark-bar-graph" label="Reports" />
            </>
          ) : (
            <>
              <SidebarItem id="home" icon="bi-house-door" label="Dashboard" />
              <SidebarItem id="company" icon="bi-building" label="Company Profiles" />
              <SidebarItem id="jobs" icon="bi-briefcase" label="Job Post Approvals" />
              <SidebarItem id="users" icon="bi-person-gear" label="User Management" />
              <SidebarItem id="email" icon="bi-envelope-paper" label="Email Composer" />
              <SidebarItem id="tickets" icon="bi-ticket" label="Ticket Monitoring" />
              <SidebarItem id="reports" icon="bi-file-earmark-bar-graph" label="Reports" />
            </>
          )}
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-bold"><i className="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto relative bg-gray-50 flex flex-col w-full">
        
        {/* Topbar */}
        <div className="bg-white border-b px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm w-full">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            {/* Mobile Hamburger / Logo Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden flex items-center gap-2 text-space-blue hover:text-mint-green focus:outline-none shrink-0"
            >
              <i className="bi bi-list text-2xl"></i>
              <i className="bi bi-buildings text-xl"></i>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-space-blue capitalize truncate">
              {viewData ? viewData.type.replace('-', ' ') : activeMenu.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-2">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-gray-500 hover:text-space-blue transition-colors focus:outline-none">
                <i className="bi bi-bell-fill text-xl"></i>
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-64 sm:w-72 bg-white rounded-xl shadow-2xl border py-2 z-50">
                    <h4 className="px-4 py-2 font-bold text-space-blue border-b text-sm">Pending Actions</h4>
                    {notifications.map(n => (
                      <div key={n.id} onClick={n.action} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b last:border-0 transition-colors">
                        <i className="bi bi-exclamation-circle text-yellow-500 mr-2"></i> {n.text}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-space-blue">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role?.toUpperCase()}</p>
              </div>
              <img src={user?.photoURL} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-mint-green object-cover" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={viewData ? viewData.type : activeMenu} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="w-full">
              
              {/* PAGE ROUTING */}
              {viewData?.type === 'hr-job-details' && <HRJobDetailsPage job={viewData.payload} goBack={() => setViewData(null)} />}
              
              {isHR && !viewData && activeMenu === 'home' && <HRDashboardHome />}
              {isHR && !viewData && activeMenu === 'company' && <HRCompanyProfile />}
              {isHR && !viewData && activeMenu === 'emp-apps' && <HREmployeeApplications />}
              {isHR && !viewData && activeMenu === 'emp-manage' && <HREmployeeManagement />}
              {isHR && !viewData && activeMenu === 'questions' && <HRQuestionsModule />}
              {isHR && !viewData && activeMenu === 'hiring' && <HRHiringProcess />}
              {isHR && !viewData && activeMenu === 'jobs' && <HRJobPosts setViewData={setViewData} />}

              {!isHR && !viewData && activeMenu === 'home' && <AdminDashboard />}
              {!isHR && !viewData && activeMenu === 'company' && <AdminCompanyProfiles addAlert={addAlert} />}
              {!isHR && !viewData && activeMenu === 'jobs' && <AdminJobApprovals addAlert={addAlert} />}
              {!isHR && !viewData && activeMenu === 'users' && <AdminUserManagement addAlert={addAlert} />}
              {!isHR && !viewData && activeMenu === 'tickets' && <AdminTickets addAlert={addAlert} />}

              {!viewData && activeMenu === 'email' && <HREmailComposer />}
              {!viewData && activeMenu === 'reports' && <ReportsView isHR={isHR} />}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;