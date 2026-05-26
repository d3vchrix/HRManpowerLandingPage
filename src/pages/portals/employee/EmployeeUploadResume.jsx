import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDB } from '../../../context/MockDBContext';

const EmployeeUploadResume = ({ user }) => {
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

export default EmployeeUploadResume;
