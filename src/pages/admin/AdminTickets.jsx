import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_TICKETS = [
  { id: 101, title: 'Payroll discrepancy — Juan dela Cruz', reporter: 'Juan dela Cruz', company: 'NovaTech Corp.', priority: 'High', status: 'Open', created: '2026-05-10', notes: 'Salary for April was short by ₱3,500.' },
  { id: 102, title: 'Workplace incident report', reporter: 'GlobalGoods Inc.', company: 'GlobalGoods Inc.', priority: 'High', status: 'In Progress', created: '2026-05-09', notes: 'Slip-and-fall incident near loading bay. Under investigation.' },
  { id: 103, title: 'Performance complaint — Andres B.', reporter: 'SafeGuard Sec.', company: 'SafeGuard Sec.', priority: 'Medium', status: 'Open', created: '2026-05-08', notes: 'Repeated tardiness and insubordination reported by client.' },
  { id: 104, title: 'Contract renewal query', reporter: 'Maria Santos', company: 'NovaTech Corp.', priority: 'Low', status: 'Resolved', created: '2026-05-05', notes: 'Employee requesting clarification on renewal terms.' },
  { id: 105, title: 'Unsafe equipment complaint', reporter: 'BuildRight PH', company: 'BuildRight PH', priority: 'High', status: 'Resolved', created: '2026-05-01', notes: 'Scaffolding safety concern reported. Rectified on-site.' },
];

const PRIORITY_STYLES = { High: 'bg-red-100 text-red-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-gray-100 text-gray-600' };
const STATUS_STYLES = { Open: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-orange-100 text-orange-700', Resolved: 'bg-green-100 text-green-700' };

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4 relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><i className="bi bi-x-lg text-lg"></i></button>
          <h2 className="text-xl font-bold text-space-blue mb-6 border-b pb-3">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AdminTickets = ({ addAlert }) => {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  const filtered = useMemo(() => tickets.filter(t =>
    (filterStatus === 'All' || t.status === filterStatus) &&
    (filterPriority === 'All' || t.priority === filterPriority) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.company.toLowerCase().includes(search.toLowerCase()))
  ), [tickets, filterStatus, filterPriority, search]);

  const updateStatus = (id, status) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
    if (activeTicket?.id === id) setActiveTicket(prev => ({ ...prev, status }));
    addAlert(`Ticket #${id} marked as "${status}".`, 'success');
  };

  const STATUSES = ['Open', 'In Progress', 'Resolved'];
  const PRIORITIES = ['High', 'Medium', 'Low'];

  return (
    <div className="space-y-6">
      {/* Summary Badges */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: tickets.filter(t => t.status === 'Open').length, color: 'border-blue-400 text-blue-700', bg: 'bg-blue-50' },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length, color: 'border-orange-400 text-orange-700', bg: 'bg-orange-50' },
          { label: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length, color: 'border-green-400 text-green-700', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border-l-4 ${s.color} rounded-xl p-4 flex items-center gap-4`}>
            <span className={`text-3xl font-extrabold ${s.color}`}>{s.count}</span>
            <span className="text-sm font-medium text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 border-b pb-5">
          <div className="relative flex-grow">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
              className="border rounded-lg pl-9 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-mint-green" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="All">All Status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="All">All Priority</option>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Title</th>
              <th className="p-4">Company</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-gray-400 text-xs">#{t.id}</td>
                  <td className="p-4 font-bold text-space-blue max-w-[200px] truncate">{t.title}</td>
                  <td className="p-4 text-gray-500">{t.company}</td>
                  <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span></td>
                  <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_STYLES[t.status]}`}>{t.status}</span></td>
                  <td className="p-4 text-gray-400 text-xs">{t.created}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveTicket(t)}
                      className="bg-space-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No tickets match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!activeTicket} onClose={() => setActiveTicket(null)} title={`Ticket #${activeTicket?.id}`}>
        {activeTicket && (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold text-space-blue">{activeTicket.title}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${PRIORITY_STYLES[activeTicket.priority]}`}>{activeTicket.priority} Priority</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_STYLES[activeTicket.status]}`}>{activeTicket.status}</span>
              </div>
            </div>
            <div className="text-sm space-y-1 bg-gray-50 rounded-lg p-3">
              <p><span className="font-semibold text-gray-600">Reporter:</span> {activeTicket.reporter}</p>
              <p><span className="font-semibold text-gray-600">Company:</span> {activeTicket.company}</p>
              <p><span className="font-semibold text-gray-600">Opened:</span> {activeTicket.created}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Notes / Details</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{activeTicket.notes}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(activeTicket.id, s)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${activeTicket.status === s ? STATUS_STYLES[s] + ' ring-2 ring-offset-1' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTickets;
