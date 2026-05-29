import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDB } from '../../../context/MockDBContext';

const EmployeeRequirements = () => {
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

export default EmployeeRequirements;
