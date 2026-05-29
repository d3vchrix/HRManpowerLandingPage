import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDB } from '../../context/MockDBContext';
import { useAuth } from '../../context/AuthContext';

// --- CAREER DETAILS ---
const CareerDetails = () => {
  const { id } = useParams();
  const { jobs, saveJob, savedJobs, unsaveJob } = useDB();
  const { user } = useAuth();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const isSaved = user && savedJobs.some(s => s.jobId === id && s.userId === user.id);
  
  if (!job) return <div className="p-8 text-center">Job not found.</div>;
  
  const handleSaveToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isSaved) {
      unsaveJob(job.id, user.id);
    } else {
      saveJob(job.id, user.id);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-start mb-6 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-space-blue mb-2">{job.role}</h1>
          <p className="text-gray-500 text-lg flex items-center gap-2"><i className="bi bi-building"></i> {job.company}</p>
          <p className="text-mint-green font-semibold mt-2"><i className="bi bi-cash"></i> PHP {job.minSalary.toLocaleString()} – {job.maxSalary.toLocaleString()}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSaveToggle} 
            className={`border-2 px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${isSaved ? 'border-mint-green bg-mint-green text-space-blue' : 'border-mint-green text-space-blue hover:bg-mint-green'}`}
          >
            <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i> {isSaved ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => user ? navigate(`/careers/${job.id}/apply`) : navigate('/login')} className="bg-space-blue text-white hover:bg-opacity-90 px-8 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"><i className="bi bi-lightning-charge"></i> Quick Apply</button>
        </div>
      </div>
      <div className="mb-8"><h3 className="text-xl font-bold text-space-blue mb-4">Job Description</h3><p className="text-gray-600 leading-relaxed">{job.description}</p></div>
      <div className="mb-8"><h3 className="text-xl font-bold text-space-blue mb-4">Requirements</h3><ul className="list-disc pl-5 text-gray-600 space-y-2"><li>Proven experience in the related field.</li><li>Strong communication skills.</li><li>Willing to work in {job.location}.</li></ul></div>
    </motion.div>
  );
};

// --- APPLICATION FORM ---
const CareerApply = () => {
  const { id } = useParams();
  const { jobs, applyForJob } = useDB();
  const { user } = useAuth();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [answers, setAnswers] = useState({});
  if (!job) return <div>Job not found.</div>;
  if (!user) { navigate('/login'); return null; }
  const handleSubmit = (e) => {
    e.preventDefault();
    applyForJob(job.id, user.id, { answers, role: job.role, company: job.company });
    navigate('/employee/jobs');
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-space-blue mb-6 border-b pb-4">Application: {job.role} at {job.company}</h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
        <h3 className="font-bold text-space-blue mb-4"><i className="bi bi-person-badge text-mint-green mr-2"></i>Your Info (Auto-populated)</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Title:</strong> {user.title}</p>
        <p className="mt-2 text-gray-600 text-sm"><strong>Summary:</strong> {user.summary}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-bold text-space-blue">Additional Questions from HR</h3>
        {job.questions?.map((q, idx) => (
          <div key={idx}><label className="block text-sm font-medium text-gray-700 mb-2">{q}</label><textarea required rows="2" className="w-full border-gray-300 rounded-lg border px-3 py-2" onChange={e => setAnswers({...answers, [idx]: e.target.value})}></textarea></div>
        ))}
        <button type="submit" className="w-full bg-mint-green text-space-blue font-bold py-3 rounded-lg hover:bg-opacity-90">Submit Application</button>
      </form>
    </motion.div>
  );
};

// --- JOB BROWSER ---
const ITEMS_PER_PAGE = 6;

const JobBrowser = () => {
  const { jobs } = useDB();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterSalary, setFilterSalary] = useState(20000);
  const [page, setPage] = useState(1);

  const filtered = jobs.filter(j =>
    (j.role.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())) &&
    j.role.toLowerCase().includes(filterRole.toLowerCase()) &&
    j.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
    (filterIndustry === '' || j.industry === filterIndustry) &&
    j.maxSalary >= filterSalary
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => { setSearch(''); setFilterRole(''); setFilterLocation(''); setFilterIndustry(''); setFilterSalary(20000); setPage(1); };

  return (
    <div>
      {/* Global Search */}
      <div className="relative mb-8">
        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
        <input type="text" placeholder="Search jobs by title or company..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm text-base focus:ring-2 focus:ring-mint-green focus:outline-none" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-lg h-fit">
          <h3 className="text-lg font-bold text-space-blue mb-4 flex items-center gap-2"><i className="bi bi-funnel"></i> Filters</h3>
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label><input type="text" placeholder="e.g. Developer" value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" placeholder="e.g. Manila" value={filterLocation} onChange={e => { setFilterLocation(e.target.value); setPage(1); }} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select value={filterIndustry} onChange={e => { setFilterIndustry(e.target.value); setPage(1); }} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">All Industries</option>
                {['IT','Logistics','Finance','Healthcare','BPO','Construction','Marketing','Retail','Security','Human Resources'].map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (PHP {filterSalary/1000}k+)</label>
              <input type="range" min="20000" max="150000" step="10000" value={filterSalary} onChange={e => { setFilterSalary(Number(e.target.value)); setPage(1); }} className="w-full accent-mint-green" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>PHP 20k</span><span>PHP 150k+</span></div>
            </div>
            <button onClick={clearFilters} className="w-full text-sm text-red-500 hover:underline">Clear All Filters</button>
          </div>
        </div>

        {/* Listings */}
        <div className="w-full md:w-3/4 space-y-4">
          <div className="text-sm text-gray-500 font-medium">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</div>
          {paged.length > 0 ? paged.map(job => (
            <motion.div key={job.id} whileHover={{ scale: 1.01 }} className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-space-blue hover:border-mint-green transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-space-blue"><Link to={`/careers/${job.id}`} className="hover:text-mint-green transition-colors">{job.role}</Link></h3>
                  <p className="text-gray-500 text-sm mt-1">{job.company} &bull; {job.location}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{job.industry}</span>
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">PHP {job.minSalary/1000}k – {job.maxSalary/1000}k</span>
                  </div>
                </div>
                <Link to={`/careers/${job.id}`} className="bg-space-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-mint-green hover:text-space-blue transition-colors whitespace-nowrap">View Details</Link>
              </div>
            </motion.div>
          )) : (
            <div className="bg-white p-12 text-center rounded-2xl shadow-md text-gray-500">No jobs found matching your filters.</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">&lt;</button>
                {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setPage(i+1)} className={`px-3 py-1 border rounded ${page===i+1?'bg-mint-green text-space-blue font-bold':'hover:bg-gray-50'}`}>{i+1}</button>)}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">&gt;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN CAREERS LAYOUT ---
const Careers = () => (
  <div className="bg-light-gray min-h-screen py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/" element={<div className="text-center mb-12"><h1 className="text-4xl font-bold text-space-blue mb-4">Job Browser</h1><p className="text-lg text-gray-600">Find your next deployment. Search, filter, and apply!</p></div>} />
        <Route path="*" element={null} />
      </Routes>
      <Routes>
        <Route path="/" element={<JobBrowser />} />
        <Route path="/:id" element={<CareerDetails />} />
        <Route path="/:id/apply" element={<CareerApply />} />
      </Routes>
    </div>
  </div>
);

export default Careers;
