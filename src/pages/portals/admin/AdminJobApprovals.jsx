import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_POSTS = [
  { id: 1, title: 'Warehouse Supervisor', company: 'GlobalGoods Inc.', slots: 3, skills: ['Logistics', 'Inventory', 'Leadership'], status: 'Pending' },
  { id: 2, title: 'IT Support Technician', company: 'NovaTech Corp.', slots: 2, skills: ['Networking', 'Windows OS', 'Help Desk'], status: 'Approved' },
  { id: 3, title: 'Security Personnel', company: 'SafeGuard Sec.', slots: 10, skills: ['Security', 'First Aid'], status: 'Fulfilled' },
  { id: 4, title: 'Cashier', company: 'RetailPro PH', slots: 5, skills: ['Customer Service', 'POS Systems'], status: 'Rejected' },
  { id: 5, title: 'Construction Worker', company: 'BuildRight PH', slots: 20, skills: ['Physical Labor', 'Safety Protocols'], status: 'Pending' },
  { id: 6, title: 'Data Encoder', company: 'MediCare Group', slots: 4, skills: ['MS Office', 'Data Entry'], status: 'Approved' },
];

const MOCK_TALENT = [
  { id: 'E-101', name: 'Jose Rizal', skills: ['Logistics', 'Leadership', 'Inventory'] },
  { id: 'E-102', name: 'Andres Bonifacio', skills: ['Security', 'First Aid', 'Leadership'] },
  { id: 'E-103', name: 'Emilio Aguinaldo', skills: ['Networking', 'Help Desk', 'Windows OS'] },
  { id: 'E-104', name: 'Apolinario Mabini', skills: ['Data Entry', 'MS Office', 'Research'] },
  { id: 'E-105', name: 'Melchora Aquino', skills: ['Customer Service', 'POS Systems', 'Cashiering'] },
  { id: 'E-106', name: 'Gabriela Silang', skills: ['Security', 'Logistics', 'Leadership'] },
];

const STATUSES = ['Pending', 'Approved', 'Rejected', 'Fulfilled'];

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Approved: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
  Fulfilled: 'bg-blue-100 text-blue-700 border-blue-200',
};

const AdminJobApprovals = ({ addAlert }) => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeJob, setActiveJob] = useState(null);
  const [view, setView] = useState('kanban'); // 'kanban' | 'list'

  const changeStatus = (id, status) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
    addAlert(`Post status updated to "${status}".`, 'info');
  };

  const matchedTalent = useMemo(() => {
    if (!activeJob) return [];
    return MOCK_TALENT.filter(emp =>
      emp.skills.some(s => activeJob.skills.includes(s))
    );
  }, [activeJob]);

  if (activeJob) {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveJob(null)} className="flex items-center gap-2 text-gray-500 hover:text-space-blue font-bold text-sm">
          <i className="bi bi-arrow-left"></i> Back to Job Posts
        </button>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-4 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-space-blue">{activeJob.title}</h2>
              <p className="text-sm text-gray-500">{activeJob.company} · {activeJob.slots} slots needed</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[activeJob.status]}`}>{activeJob.status}</span>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {activeJob.skills.map(s => (
                <span key={s} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {['Approved', 'Rejected', 'Fulfilled'].map(s => (
              <button key={s} onClick={() => { changeStatus(activeJob.id, s); setActiveJob({ ...activeJob, status: s }); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold border ${STATUS_STYLES[s]} hover:opacity-80`}>
                Mark as {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-space-blue mb-5 flex items-center gap-2">
            <i className="bi bi-lightning-charge-fill text-yellow-400"></i> Matching Talent Pool
            <span className="ml-2 text-sm font-normal text-gray-400">({matchedTalent.length} candidates matched)</span>
          </h3>
          {matchedTalent.length === 0
            ? <p className="text-gray-400 text-sm">No unassigned employees match these skill requirements.</p>
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedTalent.map(emp => {
                  const matched = emp.skills.filter(s => activeJob.skills.includes(s));
                  return (
                    <div key={emp.id} className="border border-gray-200 rounded-xl p-4 hover:border-mint-green transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-space-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-space-blue">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.map(s => (
                          <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium ${matched.includes(s) ? 'bg-mint-green text-space-blue' : 'bg-gray-100 text-gray-500'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => addAlert(`${emp.name} assigned to this post!`, 'success')}
                        className="mt-3 w-full bg-space-blue text-white text-xs py-1.5 rounded-lg font-bold">
                        Assign to Post
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-space-blue">Job Post Approvals</h3>
        <div className="flex gap-2">
          {['kanban', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${view === v ? 'bg-space-blue text-white' : 'bg-white border text-gray-500'}`}>
              <i className={`bi bi-${v === 'kanban' ? 'columns-gap' : 'list-ul'} mr-1`}></i>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {STATUSES.map(status => (
            <div key={status} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[300px]">
              <h4 className={`text-sm font-bold mb-4 flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full inline-block ${
                  status === 'Pending' ? 'bg-yellow-400' : status === 'Approved' ? 'bg-green-500' : status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'
                }`}></span>
                {status} ({posts.filter(p => p.status === status).length})
              </h4>
              <div className="space-y-3">
                {posts.filter(p => p.status === status).map(p => (
                  <div key={p.id} onClick={() => setActiveJob(p)}
                    className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-space-blue hover:shadow transition-all">
                    <p className="font-bold text-sm text-space-blue">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.company}</p>
                    <p className="text-xs text-gray-400 mt-1">{p.slots} slots · {p.skills.slice(0, 2).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                <th className="p-4">Title</th>
                <th className="p-4">Company</th>
                <th className="p-4 text-center">Slots</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-space-blue">{p.title}</td>
                  <td className="p-4 text-gray-600">{p.company}</td>
                  <td className="p-4 text-center">{p.slots}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveJob(p)} className="bg-space-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                      View / Match
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminJobApprovals;
