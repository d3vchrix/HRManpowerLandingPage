import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_USERS = [
  { id: 1, name: 'Carlo Mendoza', email: 'carlo@apex.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Rina Flores', email: 'rina@apex.com', role: 'HR', status: 'Active' },
  { id: 3, name: 'Ben Torres', email: 'ben@apex.com', role: 'Recruiter', status: 'Active' },
];

const MOCK_EMPLOYEES = [
  { id: 'E-001', name: 'Juan dela Cruz', role: 'Systems Analyst', deployed: 'NovaTech Corp.', status: 'Deployed', docs: ['ID', 'Contract', 'TOR'] },
  { id: 'E-002', name: 'Maria Santos', role: 'IT Support', deployed: 'NovaTech Corp.', status: 'Deployed', docs: ['ID', 'Contract'] },
  { id: 'E-003', name: 'Pedro Reyes', role: 'Network Admin', deployed: 'NovaTech Corp.', status: 'Deployed', docs: ['ID'] },
  { id: 'E-101', name: 'Jose Rizal', role: 'Logistics Coord.', deployed: 'Unassigned', status: 'Available', docs: ['ID', 'Contract', 'NBI'] },
  { id: 'E-102', name: 'Andres Bonifacio', role: 'Security', deployed: 'Unassigned', status: 'Available', docs: ['ID', 'NBI'] },
];

const ROLES = ['Admin', 'HR', 'Recruiter'];

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
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

const AdminUserManagement = ({ addAlert }) => {
  const [tab, setTab] = useState('staff');
  const [users, setUsers] = useState(MOCK_USERS);
  const [employees] = useState(MOCK_EMPLOYEES);
  const [dossierEmp, setDossierEmp] = useState(null);
  const [userModal, setUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleSaveUser = (e) => {
    e.preventDefault();
    const { uname, uemail, urole } = e.target;
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id
        ? { ...u, name: uname.value, email: uemail.value, role: urole.value }
        : u));
      addAlert('User updated.', 'success');
    } else {
      setUsers([...users, { id: Date.now(), name: uname.value, email: uemail.value, role: urole.value, status: 'Active' }]);
      addAlert('New staff member added.', 'success');
    }
    setUserModal(false);
  };

  const deleteUser = (id) => { setUsers(users.filter(u => u.id !== id)); addAlert('User removed.', 'success'); };

  const ROLE_BADGE = { Admin: 'bg-purple-100 text-purple-700', HR: 'bg-blue-100 text-blue-700', Recruiter: 'bg-orange-100 text-orange-700' };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {['staff', 'employees'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-bold text-sm ${tab === t ? 'bg-space-blue text-white' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}>
            {t === 'staff' ? <><i className="bi bi-shield-lock mr-2"></i>Agency Staff (RBAC)</> : <><i className="bi bi-people mr-2"></i>Employee Dossiers</>}
          </button>
        ))}
      </div>

      {/* --- STAFF RBAC TAB --- */}
      {tab === 'staff' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-bold text-space-blue">Agency Staff</h3>
            <button onClick={() => { setEditUser(null); setUserModal(true); }}
              className="bg-space-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <i className="bi bi-plus-lg"></i> Add Staff
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-space-blue">{u.name}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                    <td className="p-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">{u.status}</span></td>
                    <td className="p-4 text-center flex gap-3 justify-center">
                      <button onClick={() => { setEditUser(u); setUserModal(true); }} className="text-blue-500 hover:text-blue-700"><i className="bi bi-pencil-square"></i></button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700"><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- EMPLOYEE DOSSIERS TAB --- */}
      {tab === 'employees' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-space-blue mb-6 border-b pb-4">Employee Dossiers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                <th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Deployed To</th><th className="p-4">Status</th><th className="p-4 text-center">Dossier</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs text-gray-400">{emp.id}</td>
                    <td className="p-4 font-bold text-space-blue">{emp.name}</td>
                    <td className="p-4 text-gray-600">{emp.role}</td>
                    <td className="p-4 text-gray-500">{emp.deployed}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${emp.status === 'Deployed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => setDossierEmp(emp)} className="bg-space-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                        View 201
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      <Modal isOpen={userModal} onClose={() => setUserModal(false)} title={editUser ? 'Edit Staff Member' : 'Add Staff Member'}>
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Full Name</label>
            <input name="uname" required defaultValue={editUser?.name} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label>
            <input name="uemail" type="email" required defaultValue={editUser?.email} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Role</label>
            <select name="urole" defaultValue={editUser?.role || 'Recruiter'} className="w-full border rounded-lg px-3 py-2 text-sm">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select></div>
          <button type="submit" className="w-full bg-space-blue text-white py-2 rounded-lg font-bold">{editUser ? 'Save Changes' : 'Add Member'}</button>
        </form>
      </Modal>

      {/* Dossier Modal */}
      <Modal isOpen={!!dossierEmp} onClose={() => setDossierEmp(null)} title={`201 File — ${dossierEmp?.name}`}>
        {dossierEmp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-space-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                {dossierEmp.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-space-blue text-lg">{dossierEmp.name}</p>
                <p className="text-sm text-gray-500">{dossierEmp.role} · {dossierEmp.id}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dossierEmp.status === 'Deployed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {dossierEmp.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Deployment History</p>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <p>Currently at: <span className="font-bold text-space-blue">{dossierEmp.deployed}</span></p>
                <p className="text-xs text-gray-400 mt-1">Previous: N/A (mock data)</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Uploaded Documents</p>
              <div className="flex flex-wrap gap-2">
                {dossierEmp.docs.map(doc => (
                  <span key={doc} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <i className="bi bi-file-earmark-check"></i> {doc}
                  </span>
                ))}
              </div>
              <button onClick={() => addAlert('Document uploaded! (mock)', 'success')}
                className="mt-3 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg px-4 py-2 hover:border-space-blue hover:text-space-blue transition-colors">
                <i className="bi bi-upload mr-2"></i> Upload Document
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Performance Remarks</p>
              <textarea rows={3} defaultValue="No remarks yet." className="w-full border rounded-lg px-3 py-2 text-sm" />
              <button onClick={() => addAlert('Remarks saved.', 'success')} className="mt-2 bg-space-blue text-white text-sm px-4 py-2 rounded-lg font-bold">
                Save Remarks
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
