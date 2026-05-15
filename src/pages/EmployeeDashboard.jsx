import { useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/MockDBContext';

// --- ACCOUNT INFO ---
const AccountInfo = ({ user, updateProfile }) => {
  const { addAlert } = useDB();
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.photoURL);
  const fileRef = useRef();
  const [formData, setFormData] = useState({
    firstName: user.firstName || 'Christian',
    middleName: user.middleName || '',
    lastName: user.lastName || 'Employee',
    title: user.title || '',
    summary: user.summary || '',
    status: user.status || 'Looking',
    gender: user.gender || '',
    genderPublic: user.genderPublic || false,
    profilePublic: user.profilePublic || true,
    education: user.education || '',
    certifications: user.certifications || '',
    experiences: user.experiences || [{ company: '', role: '', summary: '', current: false, from: '', to: '' }],
  });

  const setF = (field, value) => setFormData(f => ({ ...f, [field]: value }));

  const updateExp = (i, field, value) => {
    const updated = formData.experiences.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    setF('experiences', updated);
  };

  const addExp = () => setF('experiences', [...formData.experiences, { company: '', role: '', summary: '', current: false, from: '', to: '' }]);
  const removeExp = i => setF('experiences', formData.experiences.filter((_, idx) => idx !== i));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    addAlert('Profile picture updated!', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ ...formData, name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim() });
    addAlert('Account Information updated!', 'success');
    setEditMode(false);
  };

  const statusColors = { Looking: 'bg-blue-100 text-blue-800', Hired: 'bg-green-100 text-green-800', Employed: 'bg-mint-green text-space-blue', Unemployed: 'bg-red-100 text-red-800' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-space-blue">Personal Information</h3>
        <button onClick={() => setEditMode(!editMode)} className={`px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${editMode ? 'bg-gray-200 text-gray-700' : 'bg-space-blue text-white hover:bg-mint-green hover:text-space-blue'}`}>
          <i className={`bi ${editMode ? 'bi-x' : 'bi-pencil'}`}></i> {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => editMode && fileRef.current.click()}>
          <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-mint-green object-cover" />
          {editMode && <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="bi bi-camera text-white text-xl"></i></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        <div>
          <p className="font-bold text-space-blue text-lg">{`${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[formData.status] || 'bg-gray-100 text-gray-600'}`}>{formData.status}</span>
        </div>
      </div>

      {!editMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Title:</span> <span className="font-medium">{formData.title || '—'}</span></div>
          <div><span className="text-gray-500">Status:</span> <span className="font-medium">{formData.status}</span></div>
          <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{formData.genderPublic ? (formData.gender || '—') : 'Private'}</span></div>
          <div><span className="text-gray-500">Profile:</span> <span className="font-medium">{formData.profilePublic ? 'Public' : 'Private'}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500">Education:</span> <span className="font-medium">{formData.education || '—'}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500">Certifications:</span> <span className="font-medium">{formData.certifications || '—'}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500">Summary:</span> <p className="font-medium">{formData.summary || '—'}</p></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">First Name</label><input value={formData.firstName} onChange={e => setF('firstName', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Middle Name</label><input value={formData.middleName} onChange={e => setF('middleName', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label><input value={formData.lastName} onChange={e => setF('lastName', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Professional Title</label>
              <input value={formData.title} onChange={e => setF('title', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Employee Status</label>
              <select value={formData.status} onChange={e => setF('status', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>Looking</option><option>Hired</option><option>Employed</option><option>Unemployed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setF('gender', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Prefer not to say</option>
                <option>Male</option><option>Female</option><option>Non-binary</option><option>Genderqueer</option><option>Genderfluid</option><option>Agender</option><option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">
                <input type="checkbox" checked={formData.genderPublic} onChange={e => setF('genderPublic', e.target.checked)} className="rounded" />
                Show gender publicly
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.profilePublic} onChange={e => setF('profilePublic', e.target.checked)} className="rounded" />
                Profile is Public
              </label>
            </div>
          </div>

          <div><label className="block text-xs font-medium text-gray-500 mb-1">Professional Summary</label><textarea rows="3" value={formData.summary} onChange={e => setF('summary', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Education Level</label>
            <select value={formData.education} onChange={e => setF('education', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select Education</option>
              <option>High School Graduate</option><option>Vocational / TESDA</option><option>Some College</option><option>Bachelor&apos;s Degree</option><option>Master&apos;s Degree</option><option>Doctorate / PhD</option>
            </select>
          </div>

          <div><label className="block text-xs font-medium text-gray-500 mb-1">Certifications (Optional)</label><textarea rows="2" value={formData.certifications} onChange={e => setF('certifications', e.target.value)} placeholder="e.g. AWS Certified, PRC License No. XXXXX" className="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>

          {/* Work Experience */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-space-blue">Work Experience</label>
              <button type="button" onClick={addExp} className="text-mint-green text-sm font-bold hover:underline">+ Add Experience</button>
            </div>
            <div className="space-y-6">
              {formData.experiences.map((exp, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                  <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs"><i className="bi bi-trash"></i></button>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="text-xs text-gray-500">Company</label><input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
                    <div><label className="text-xs text-gray-500">Role / Position</label><input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
                  </div>
                  <div className="mb-3"><label className="text-xs text-gray-500">Job Summary</label><textarea rows="2" value={exp.summary} onChange={e => updateExp(i, 'summary', e.target.value)} className="w-full border rounded px-3 py-2 text-sm mt-1"></textarea></div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer mb-3">
                    <input type="checkbox" checked={exp.current} onChange={e => updateExp(i, 'current', e.target.checked)} className="rounded" /> Currently employed here
                  </label>
                  {!exp.current && (
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-gray-500">From</label><input type="month" value={exp.from} onChange={e => updateExp(i, 'from', e.target.value)} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
                      <div><label className="text-xs text-gray-500">To</label><input type="month" value={exp.to} onChange={e => updateExp(i, 'to', e.target.value)} className="w-full border rounded px-3 py-2 text-sm mt-1" /></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-mint-green text-space-blue font-bold px-8 py-2 rounded-lg hover:bg-opacity-90">Save Changes</button>
        </form>
      )}
    </div>
  );
};

// --- UPLOAD RESUME ---
const UploadResume = ({ user }) => {
  const { addAlert } = useDB();
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowPreview(true); addAlert('Resume generated!'); }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-mint-green transition-colors cursor-pointer bg-gray-50">
          <i className="bi bi-cloud-arrow-up text-5xl text-mint-green mb-4 block"></i>
          <p className="text-lg font-medium text-space-blue">Drag & Drop Resume</p>
          <p className="text-sm text-gray-500 mt-2">PDF or DOCX only (Max 5MB)</p>
        </div>
        <div className="text-center border-2 border-gray-200 rounded-lg p-12 bg-white shadow-sm flex flex-col justify-center items-center">
          <i className="bi bi-file-earmark-person text-5xl text-space-blue mb-4 block"></i>
          <p className="text-lg font-medium text-space-blue mb-4">Auto-Generate from Profile</p>
          <button onClick={handleGenerate} disabled={generating} className="bg-space-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-mint-green hover:text-space-blue transition-colors w-full">
            {generating ? 'Generating...' : 'Auto-Generate Resume'}
          </button>
        </div>
      </div>
      {showPreview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-lg p-8 bg-white shadow-inner">
          <div className="flex justify-between mb-6 border-b pb-4">
            <h3 className="text-2xl font-bold text-space-blue">Resume Preview</h3>
            <button className="text-mint-green font-bold"><i className="bi bi-download"></i> Download PDF</button>
          </div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-xl text-gray-600">{user.title}</p>
          <p className="text-sm text-gray-500 mb-6">{user.email}</p>
          <h3 className="text-lg font-bold border-b mb-2">Summary</h3>
          <p className="mb-6">{user.summary}</p>
          {user.experiences?.map((e, i) => (
            <div key={i} className="mb-4">
              <p className="font-bold">{e.role} — {e.company}</p>
              <p className="text-xs text-gray-500">{e.current ? 'Present' : `${e.from} → ${e.to}`}</p>
              <p className="text-sm text-gray-600 mt-1">{e.summary}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// --- REQUIREMENTS ---
const Requirements = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeReq, setActiveReq] = useState('');
  const { addAlert } = useDB();
  const docs = [
    { name: 'Valid ID', desc: 'Government issued (Passport, License)', status: 'verified' },
    { name: 'NBI Clearance', desc: 'Must be valid within 6 months', status: 'pending' },
    { name: 'Medical Certificate', desc: 'Fit-to-work certificate', status: 'pending' },
  ];
  return (
    <>
      <ul className="space-y-4">
        {docs.map(d => (
          <li key={d.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border rounded-xl shadow-sm">
            <div><span className="font-bold text-space-blue block">{d.name}</span><span className="text-sm text-gray-500">{d.desc}</span></div>
            {d.status === 'verified'
              ? <div className="mt-4 sm:mt-0 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-semibold"><i className="bi bi-check-circle-fill"></i> Verified</div>
              : <button onClick={() => { setActiveReq(d.name); setModalOpen(true); }} className="mt-4 sm:mt-0 bg-mint-green text-space-blue px-6 py-2 rounded-lg font-bold">Upload</button>}
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
              <div className="flex justify-between mb-6"><h3 className="text-xl font-bold text-space-blue">Upload {activeReq}</h3><button onClick={() => setModalOpen(false)} className="text-gray-400 text-2xl">&times;</button></div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-mint-green cursor-pointer" onClick={() => { setModalOpen(false); addAlert(`${activeReq} uploaded!`); }}>
                <i className="bi bi-file-earmark-arrow-up text-5xl text-mint-green mb-4 block"></i>
                <p className="font-medium text-space-blue">Click or drag file here</p>
                <p className="text-xs text-gray-500 mt-2">PDF, JPEG, PNG. Max 2MB.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- TRACK JOBS ---
const TrackJobs = ({ user }) => {
  const { applications, jobs } = useDB();
  const myApps = applications.filter(a => a.userId === user.id);
  if (myApps.length === 0) return <div className="text-center py-12 text-gray-500">You haven&apos;t applied to any jobs yet.</div>;
  return (
    <div className="space-y-4">
      {myApps.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (!job) return null;
        return (
          <div key={app.id} className="border bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-bold text-space-blue text-lg"><Link to={`/careers/${job.id}`} className="hover:text-mint-green">{job.role}</Link></h4>
              <p className="text-gray-500 text-sm">{job.company} &bull; Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <span className={`mt-4 md:mt-0 text-sm px-3 py-1 rounded-full font-bold ${app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{app.status}</span>
          </div>
        );
      })}
    </div>
  );
};

// --- SAVED JOBS ---
const SavedJobs = ({ user }) => {
  const { savedJobs, jobs } = useDB();
  const mySaved = savedJobs.filter(s => s.userId === user.id);
  if (mySaved.length === 0) return <div className="text-center py-12 text-gray-500">No saved jobs found.</div>;
  return (
    <div className="space-y-4">
      {mySaved.map(s => {
        const job = jobs.find(j => j.id === s.jobId);
        if (!job) return null;
        return (
          <div key={s.jobId} className="border bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
            <div><h4 className="font-bold text-space-blue text-lg"><Link to={`/careers/${job.id}`} className="hover:text-mint-green">{job.role}</Link></h4><p className="text-gray-500 text-sm">{job.company} &bull; {job.location}</p></div>
            <Link to={`/careers/${job.id}`} className="mt-4 md:mt-0 bg-space-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-mint-green hover:text-space-blue transition-colors">Apply Now</Link>
          </div>
        );
      })}
    </div>
  );
};

// --- SETTINGS ---
const Settings = ({ user, updateProfile }) => {
  const { addAlert } = useDB();
  const [settings, setSettings] = useState(user.settings || { newsletter: true, jobAlerts: true, hrUpdates: true });

  return (
    <div className="space-y-10">
      <form onSubmit={e => { e.preventDefault(); updateProfile({ settings }); addAlert('Settings saved!'); }} className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-space-blue mb-6 border-b pb-4">Email Preferences</h3>
        {[['newsletter', 'Subscribe to Apex Newsletter'], ['jobAlerts', 'Receive Job Alerts matching your profile'], ['hrUpdates', 'Application Follow-ups & HR Updates']].map(([k, l]) => (
          <label key={k} className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="checkbox" checked={settings[k]} onChange={e => setSettings({ ...settings, [k]: e.target.checked })} className="w-5 h-5 text-mint-green rounded" /> <span className="text-gray-700">{l}</span>
          </label>
        ))}
        <button type="submit" className="mt-2 bg-mint-green text-space-blue font-bold px-6 py-2 rounded-lg">Save Preferences</button>
      </form>
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-500 mb-4">Requesting deletion will permanently wipe your data.</p>
        <button onClick={() => { if (window.confirm('Request account deletion?')) addAlert('Deletion request sent.', 'error'); }} className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg">Request Account Deletion</button>
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

  const titles = { account: 'Account Information', resume: 'Resume Management', requirements: 'Check Requirements', jobs: 'Track Applications', saved: 'Saved Jobs', settings: 'Settings' };

  return (
    <div className="bg-light-gray min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-64 bg-space-blue text-white p-6 shrink-0">
            <div className="text-center mb-8 hidden md:block">
              <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto border-4 border-mint-green mb-4 object-cover" />
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-mint-green text-sm">{user.title}</p>
            </div>
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
              {[['account','bi-person','Profile'],['resume','bi-file-earmark-text','Resume'],['requirements','bi-list-check','Requirements'],['jobs','bi-briefcase','Applications'],['saved','bi-bookmark','Saved'],['settings','bi-gear','Settings']].map(([p, ic, lb]) => (
                <Link key={p} to={`/employee/${p}`} className={`whitespace-nowrap px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${path === p ? 'bg-mint-green text-space-blue font-bold' : 'hover:bg-white hover:bg-opacity-10'}`}>
                  <i className={`bi ${ic}`}></i> {lb}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-grow p-8 bg-gray-50 min-h-[600px]">
            <div className="mb-8 border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-bold text-space-blue">{titles[path] || 'Dashboard'}</h2>
            </div>
            {path === 'account' && <AccountInfo user={user} updateProfile={updateProfile} />}
            {path === 'resume' && <UploadResume user={user} />}
            {path === 'requirements' && <Requirements />}
            {path === 'jobs' && <TrackJobs user={user} />}
            {path === 'saved' && <SavedJobs user={user} />}
            {path === 'settings' && <Settings user={user} updateProfile={updateProfile} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
