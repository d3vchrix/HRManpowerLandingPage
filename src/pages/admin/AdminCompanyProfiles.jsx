import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COMPANIES = [
  { id: 1, name: 'NovaTech Corp.', industry: 'Technology', contact: 'jane@novatech.com', deployed: 54, status: 'Active' },
  { id: 2, name: 'GlobalGoods Inc.', industry: 'Logistics', contact: 'ops@globalgoods.ph', deployed: 41, status: 'Active' },
  { id: 3, name: 'BuildRight PH', industry: 'Construction', contact: 'hr@buildright.ph', deployed: 38, status: 'Active' },
  { id: 4, name: 'Apex Logistics', industry: 'Supply Chain', contact: 'admin@apexlog.com', deployed: 27, status: 'Active' },
  { id: 5, name: 'MediCare Group', industry: 'Healthcare', contact: 'info@medicare.ph', deployed: 19, status: 'Inactive' },
  { id: 6, name: 'FoodFirst Corp.', industry: 'Food & Beverage', contact: 'hr@foodfirst.com', deployed: 14, status: 'Active' },
  { id: 7, name: 'RetailPro PH', industry: 'Retail', contact: 'ops@retailpro.ph', deployed: 22, status: 'Active' },
  { id: 8, name: 'SafeGuard Sec.', industry: 'Security', contact: 'mgmt@safeguard.ph', deployed: 33, status: 'Active' },
];

const MOCK_DEPLOYED = {
  1: [
    { empId: 'E-001', name: 'Juan dela Cruz', role: 'Systems Analyst', start: '2025-01-10', end: '2026-01-10', billing: 'Paid' },
    { empId: 'E-002', name: 'Maria Santos', role: 'IT Support', start: '2025-03-01', end: '2026-03-01', billing: 'Pending' },
    { empId: 'E-003', name: 'Pedro Reyes', role: 'Network Admin', start: '2024-11-15', end: '2025-11-15', billing: 'Overdue' },
  ],
  2: [
    { empId: 'E-010', name: 'Ana Gomez', role: 'Logistics Coordinator', start: '2025-06-01', end: '2026-06-01', billing: 'Paid' },
  ],
};

const PAGE_SIZE = 5;

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <i className="bi bi-x-lg text-lg"></i>
          </button>
          <h2 className="text-xl font-bold text-space-blue mb-6 border-b pb-3">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const billingBadge = (status) => {
  const map = { Paid: 'bg-green-100 text-green-700', Pending: 'bg-yellow-100 text-yellow-700', Overdue: 'bg-red-100 text-red-700' };
  return <span className={`text-xs font-bold px-2 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const AdminCompanyProfiles = ({ addAlert }) => {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const filtered = useMemo(() =>
    companies.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    ), [companies, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (c, e) => { e.stopPropagation(); setEditTarget(c); setModalOpen(true); };
  const deleteCompany = (id, e) => {
    e.stopPropagation();
    setCompanies(companies.filter(c => c.id !== id));
    addAlert('Company removed.', 'success');
  };
  const handleSave = (e) => {
    e.preventDefault();
    const { cname, cindustry, ccontact, cstatus } = e.target;
    if (editTarget) {
      setCompanies(companies.map(c => c.id === editTarget.id
        ? { ...c, name: cname.value, industry: cindustry.value, contact: ccontact.value, status: cstatus.value }
        : c));
      addAlert('Company updated.', 'success');
    } else {
      setCompanies([...companies, { id: Date.now(), name: cname.value, industry: cindustry.value, contact: ccontact.value, deployed: 0, status: cstatus.value }]);
      addAlert('Company added.', 'success');
    }
    setModalOpen(false);
  };

  if (selectedCompany) {
    const deployed = MOCK_DEPLOYED[selectedCompany.id] || [];
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <button onClick={() => setSelectedCompany(null)} className="flex items-center gap-2 text-gray-500 hover:text-space-blue font-bold text-sm mb-6">
          <i className="bi bi-arrow-left"></i> Back to Companies
        </button>
        <div className="flex items-start justify-between mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-space-blue">{selectedCompany.name}</h2>
            <p className="text-sm text-gray-500">{selectedCompany.industry} · {selectedCompany.contact}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedCompany.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {selectedCompany.status}
          </span>
        </div>
        <h3 className="font-bold text-space-blue mb-4 flex items-center gap-2">
          <i className="bi bi-person-lines-fill text-mint-green"></i> Deployed Employees ({deployed.length})
        </h3>
        {deployed.length === 0
          ? <p className="text-gray-400 text-sm">No employees currently deployed to this company.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contract Start</th>
                    <th className="p-4">Contract End</th>
                    <th className="p-4">Billing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deployed.map(emp => (
                    <tr key={emp.empId} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-500">{emp.empId}</td>
                      <td className="p-4 font-bold text-space-blue">{emp.name}</td>
                      <td className="p-4 text-gray-600">{emp.role}</td>
                      <td className="p-4 text-gray-500">{emp.start}</td>
                      <td className="p-4 text-gray-500">{emp.end}</td>
                      <td className="p-4">{billingBadge(emp.billing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
        <h3 className="text-2xl font-bold text-space-blue">Client Companies</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="border rounded-lg pl-9 pr-4 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-mint-green"
            />
          </div>
          <button onClick={openAdd} className="bg-space-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap">
            <i className="bi bi-plus-lg"></i> Add Company
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
              <th className="p-4">Company Name</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Contact</th>
              <th className="p-4 text-center">Deployed</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map(c => (
              <tr key={c.id} onClick={() => setSelectedCompany(c)} className="hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="p-4 font-bold text-space-blue">{c.name}</td>
                <td className="p-4 text-gray-600">{c.industry}</td>
                <td className="p-4 text-gray-500">{c.contact}</td>
                <td className="p-4 text-center font-bold">{c.deployed}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex gap-3 justify-center" onClick={e => e.stopPropagation()}>
                    <button onClick={e => openEdit(c, e)} className="text-blue-500 hover:text-blue-700">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button onClick={e => deleteCompany(c.id, e)} className="text-red-500 hover:text-red-700">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No companies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
        <span>Showing {paged.length} of {filtered.length} companies</span>
        <div className="flex gap-1">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-40">&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-mint-green text-space-blue font-bold' : 'hover:bg-gray-50'}`}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded bg-gray-50 disabled:opacity-40">&gt;</button>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Company' : 'Add New Company'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Company Name</label>
            <input name="cname" required defaultValue={editTarget?.name} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Industry</label>
            <input name="cindustry" required defaultValue={editTarget?.industry} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Contact Email</label>
            <input name="ccontact" type="email" required defaultValue={editTarget?.contact} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Status</label>
            <select name="cstatus" defaultValue={editTarget?.status || 'Active'} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Active</option><option>Inactive</option>
            </select></div>
          <button type="submit" className="w-full bg-space-blue text-white py-2 rounded-lg font-bold">
            {editTarget ? 'Save Changes' : 'Add Company'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCompanyProfiles;
