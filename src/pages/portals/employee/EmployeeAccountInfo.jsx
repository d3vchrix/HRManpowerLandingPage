import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDB } from '../../../context/MockDBContext';

// --- FORMATTER HELPERS ---
const formatters = {
  textOnly: (val) => val.replace(/[^a-zA-Z\s.-]/g, ''),
  mobile: (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,4})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  },
  sss: (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    const match = cleaned.match(/^(\d{0,2})(\d{0,7})(\d{0,1})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  },
  philhealth: (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const match = cleaned.match(/^(\d{0,2})(\d{0,9})(\d{0,1})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  },
  pagibig: (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  },
  tin: (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,3})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join('-');
  }
};

const EmployeeAccountInfo = ({ user, updateProfile }) => {
  const { addAlert } = useDB();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [avatarPreview, setAvatarPreview] = useState(user.photoURL || 'https://via.placeholder.com/150');
  const fileRef = useRef();

  const [formData, setFormData] = useState({
    firstName: user.firstName || '', middleName: user.middleName || '', lastName: user.lastName || '', suffix: user.suffix || '',
    dob: user.dob || '', placeOfBirth: user.placeOfBirth || '', gender: user.gender || '', civilStatus: user.civilStatus || '',
    nationality: user.nationality || 'Filipino', bloodType: user.bloodType || '',
    mobile: user.mobile || '', address: user.address || '',
    sss: user.sss || '', philhealth: user.philhealth || '', pagibig: user.pagibig || '', tin: user.tin || '',
    emergencyName: user.emergencyName || '', emergencyRelation: user.emergencyRelation || '', emergencyContact: user.emergencyContact || '',
    title: user.title || '', summary: user.summary || '', status: user.status || 'Looking', education: user.education || '',
    profilePublic: user.profilePublic !== undefined ? user.profilePublic : true,
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

  const steps = [
    { id: 'personal', title: 'Personal Details' },
    { id: 'contact', title: 'Contact Info' },
    { id: 'gov', title: 'Government IDs' },
    { id: 'emergency', title: 'Emergency Contact' },
    { id: 'professional', title: 'Professional Background' },
    { id: 'review', title: 'Review & Submit' }
  ];

  // Submission handler
  const handleNextOrSubmit = (e) => {
    e.preventDefault(); 
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.suffix}`.trim().replace(/\s+/g, ' ');
      updateProfile({ ...formData, name: fullName });
      addAlert('201 File Information successfully updated!', 'success');
      setIsModalOpen(false);
      setCurrentStep(0);
    }
  };

  // Draft handler
  const handleSaveDraft = () => {
    const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.suffix}`.trim().replace(/\s+/g, ' ');
    updateProfile({ ...formData, name: fullName });
    addAlert('Draft saved successfully.', 'info');
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [isModalOpen]);

  const statusColors = { Looking: 'bg-blue-100 text-blue-800', Hired: 'bg-green-100 text-green-800', Employed: 'bg-mint-green text-space-blue', Unemployed: 'bg-red-100 text-red-800' };
  const SectionHeader = ({ title }) => <h4 className="text-lg font-bold text-space-blue border-b border-gray-200 pb-2 mb-4 mt-4">{title}</h4>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-space-blue">Employee 201 File</h3>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors bg-space-blue text-white hover:bg-mint-green hover:text-space-blue shadow-md"
        >
          <i className="bi bi-pencil"></i> Edit 201 File
        </button>
      </div>

      {/* --- DASHBOARD VIEW MODE --- */}
      <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-mint-green object-cover" />
        <div>
          <p className="font-bold text-space-blue text-2xl">
            {`${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.suffix}`.trim().replace(/\s+/g, ' ') || 'Employee Name'}
          </p>
          <p className="text-gray-500 font-medium">{formData.title || 'Position Title'}</p>
          <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-bold ${statusColors[formData.status] || 'bg-gray-100 text-gray-600'}`}>{formData.status}</span>
        </div>
      </div>

      <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="md:col-span-3"><SectionHeader title="Personal Details" /></div>
          <div><span className="text-gray-500 block mb-1">Date of Birth:</span> <span className="font-medium">{formData.dob || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Place of Birth:</span> <span className="font-medium">{formData.placeOfBirth || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Gender:</span> <span className="font-medium">{formData.gender || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Civil Status:</span> <span className="font-medium">{formData.civilStatus || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Nationality:</span> <span className="font-medium">{formData.nationality || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Blood Type:</span> <span className="font-medium">{formData.bloodType || '—'}</span></div>

          <div className="md:col-span-3"><SectionHeader title="Contact & Emergency Info" /></div>
          <div><span className="text-gray-500 block mb-1">Mobile Number:</span> <span className="font-medium">{formData.mobile || '—'}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Current Address:</span> <span className="font-medium">{formData.address || '—'}</span></div>
          <div className="bg-red-50 p-4 rounded-lg md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border border-red-100">
            <div><span className="text-red-400 text-xs font-bold uppercase block mb-1">Emergency Contact</span> <span className="font-bold text-gray-800">{formData.emergencyName || '—'}</span></div>
            <div><span className="text-red-400 text-xs font-bold uppercase block mb-1">Relationship</span> <span className="font-medium text-gray-800">{formData.emergencyRelation || '—'}</span></div>
            <div><span className="text-red-400 text-xs font-bold uppercase block mb-1">Contact Number</span> <span className="font-medium text-gray-800">{formData.emergencyContact || '—'}</span></div>
          </div>

          <div className="md:col-span-3"><SectionHeader title="Government Statutory Numbers" /></div>
          <div><span className="text-gray-500 block mb-1">SSS Number:</span> <span className="font-medium">{formData.sss || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">PhilHealth Number:</span> <span className="font-medium">{formData.philhealth || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">Pag-IBIG / HDMF:</span> <span className="font-medium">{formData.pagibig || '—'}</span></div>
          <div><span className="text-gray-500 block mb-1">TIN:</span> <span className="font-medium">{formData.tin || '—'}</span></div>

          <div className="md:col-span-3"><SectionHeader title="Professional Background" /></div>
          <div><span className="text-gray-500 block mb-1">Education Level:</span> <span className="font-medium">{formData.education || '—'}</span></div>
          <div className="md:col-span-2"><span className="text-gray-500 block mb-1">Professional Summary:</span> <p className="font-medium">{formData.summary || '—'}</p></div>
        </div>
      </div>

      {/* --- WIZARD MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-4xl my-4 sm:my-8 flex flex-col max-h-[95vh] sm:max-h-[90vh]"
            >
              
              {/* Header & Clickable Progress Bar */}
              <div className="p-4 sm:p-6 border-b border-gray-200 shrink-0">
                <div className="flex justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-space-blue">Update 201 File</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl sm:text-3xl leading-none shrink-0">&times;</button>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex justify-between mb-2 text-xs sm:text-sm">
                    {steps.map((step, idx) => (
                      <button 
                        key={step.id} 
                        type="button"
                        onClick={() => setCurrentStep(idx)}
                        className={`text-xs font-bold focus:outline-none transition-colors ${
                          idx === currentStep ? 'text-mint-green' : idx < currentStep ? 'text-space-blue hover:text-mint-green' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <span className="hidden sm:inline">{idx + 1}. {step.title}</span>
                        <span className="sm:hidden">{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-mint-green transition-all duration-300"
                    ></motion.div>
                  </div>
                </div>
              </div>

              {/* Form Content Body */}
              <form id="wizard-form" onSubmit={handleNextOrSubmit} className="flex flex-col overflow-hidden grow">
                <div className="p-4 sm:p-6 overflow-y-auto grow custom-scrollbar space-y-4">
                  
                  {/* STEP 1: Personal Details */}
                  {currentStep === 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                        <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
                          <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-mint-green object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="bi bi-camera text-white"></i></div>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        <div><p className="font-bold text-space-blue">Profile Photo</p><p className="text-xs text-gray-500">Click to upload a professional photo.</p></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">First Name <span className="text-red-500">*</span></label><input required value={formData.firstName} onChange={e => setF('firstName', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Middle Name</label><input value={formData.middleName} onChange={e => setF('middleName', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Last Name <span className="text-red-500">*</span></label><input required value={formData.lastName} onChange={e => setF('lastName', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Suffix (Jr., Sr.)</label><input value={formData.suffix} onChange={e => setF('suffix', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth <span className="text-red-500">*</span></label><input type="date" required value={formData.dob} onChange={e => setF('dob', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Place of Birth</label><input value={formData.placeOfBirth} onChange={e => setF('placeOfBirth', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Gender <span className="text-red-500">*</span></label>
                          <select required value={formData.gender} onChange={e => setF('gender', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green">
                            <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Civil Status <span className="text-red-500">*</span></label>
                          <select required value={formData.civilStatus} onChange={e => setF('civilStatus', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green">
                            <option value="">Select Status</option><option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Blood Type</label>
                          <select value={formData.bloodType} onChange={e => setF('bloodType', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green">
                            <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option><option>Unknown</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Contact Info */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number <span className="text-red-500">*</span></label><input required type="tel" value={formData.mobile} onChange={e => setF('mobile', formatters.mobile(e.target.value))} placeholder="09XX-XXX-XXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Nationality</label><input value={formData.nationality} onChange={e => setF('nationality', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                      <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Current Address <span className="text-red-500">*</span></label><textarea required rows="3" value={formData.address} onChange={e => setF('address', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green"></textarea></div>
                    </motion.div>
                  )}

                  {/* STEP 3: Government IDs */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">SSS Number</label><input value={formData.sss} onChange={e => setF('sss', formatters.sss(e.target.value))} placeholder="XX-XXXXXXX-X" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">PhilHealth Number</label><input value={formData.philhealth} onChange={e => setF('philhealth', formatters.philhealth(e.target.value))} placeholder="XX-XXXXXXXXX-X" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Pag-IBIG Number</label><input value={formData.pagibig} onChange={e => setF('pagibig', formatters.pagibig(e.target.value))} placeholder="XXXX-XXXX-XXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">TIN</label><input value={formData.tin} onChange={e => setF('tin', formatters.tin(e.target.value))} placeholder="XXX-XXX-XXX-000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                    </motion.div>
                  )}

                  {/* STEP 4: Emergency */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-red-50 p-4 sm:p-6 rounded-xl border border-red-100">
                      <div><label className="block text-xs font-medium text-red-800 mb-1">Contact Name <span className="text-red-500">*</span></label><input required value={formData.emergencyName} onChange={e => setF('emergencyName', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
                      <div><label className="block text-xs font-medium text-red-800 mb-1">Relationship <span className="text-red-500">*</span></label><input required value={formData.emergencyRelation} onChange={e => setF('emergencyRelation', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
                      <div><label className="block text-xs font-medium text-red-800 mb-1">Contact Number <span className="text-red-500">*</span></label><input required type="tel" value={formData.emergencyContact} onChange={e => setF('emergencyContact', formatters.mobile(e.target.value))} placeholder="09XX-XXX-XXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
                    </motion.div>
                  )}

                  {/* STEP 5: Professional */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Current Job Title</label><input value={formData.title} onChange={e => setF('title', formatters.textOnly(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green" /></div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Employment Status</label>
                          <select value={formData.status} onChange={e => setF('status', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green">
                            <option>Looking</option><option>Hired</option><option>Employed</option><option>Unemployed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Highest Education Attained</label>
                          <select value={formData.education} onChange={e => setF('education', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green">
                            <option value="">Select Education</option><option>High School Graduate</option><option>Vocational / TESDA</option><option>Bachelor&apos;s Degree</option><option>Master&apos;s Degree</option>
                          </select>
                        </div>
                        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Professional Summary</label><textarea rows="2" value={formData.summary} onChange={e => setF('summary', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-mint-green"></textarea></div>
                      </div>

                      <div className="flex justify-between items-center mb-3 mt-6">
                        <label className="block text-sm font-bold text-space-blue">Work Experience</label>
                        <button type="button" onClick={addExp} className="text-mint-green text-sm font-bold hover:underline">+ Add Experience</button>
                      </div>
                      <div className="space-y-4">
                        {formData.experiences.map((exp, i) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50 relative">
                            <button type="button" onClick={() => removeExp(i)} className="absolute top-2 right-2 sm:top-3 sm:right-3 text-red-400 hover:text-red-600 text-xs"><i className="bi bi-trash text-lg"></i></button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                              <div><label className="text-xs text-gray-500">Company</label><input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-mint-green" /></div>
                              <div><label className="text-xs text-gray-500">Role / Position</label><input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-mint-green" /></div>
                            </div>
                            <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer mb-3">
                              <input type="checkbox" checked={exp.current} onChange={e => updateExp(i, 'current', e.target.checked)} className="rounded text-mint-green focus:ring-mint-green" /> Currently employed here
                            </label>
                            {!exp.current && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                <div><label className="text-xs text-gray-500">From</label><input type="month" value={exp.from} onChange={e => updateExp(i, 'from', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-mint-green" /></div>
                                <div><label className="text-xs text-gray-500">To</label><input type="month" value={exp.to} onChange={e => updateExp(i, 'to', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:ring-mint-green" /></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 6: Review & Submit */}
                  {currentStep === 5 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                        <SectionHeader title="Personal Details Review" />
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                          <div><span className="text-gray-500">Full Name:</span> <span className="font-medium">{`${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.suffix}`.trim().replace(/\s+/g, ' ') || '—'}</span></div>
                          <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formData.dob || '—'}</span></div>
                          <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{formData.gender || '—'}</span></div>
                          <div><span className="text-gray-500">Civil Status:</span> <span className="font-medium">{formData.civilStatus || '—'}</span></div>
                          <div><span className="text-gray-500">Blood Type:</span> <span className="font-medium">{formData.bloodType || '—'}</span></div>
                          <div><span className="text-gray-500">Nationality:</span> <span className="font-medium">{formData.nationality || '—'}</span></div>
                        </div>

                        <SectionHeader title="Contact & Emergency Review" />
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                          <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{formData.mobile || '—'}</span></div>
                          <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium">{formData.address || '—'}</span></div>
                          <div className="col-span-2 mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <span className="text-red-500 font-bold block mb-1">Emergency Contact</span>
                            <span className="font-medium">{formData.emergencyName} ({formData.emergencyRelation}) - {formData.emergencyContact}</span>
                          </div>
                        </div>

                        <SectionHeader title="Government IDs Review" />
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                          <div><span className="text-gray-500">SSS:</span> <span className="font-medium">{formData.sss || '—'}</span></div>
                          <div><span className="text-gray-500">PhilHealth:</span> <span className="font-medium">{formData.philhealth || '—'}</span></div>
                          <div><span className="text-gray-500">Pag-IBIG:</span> <span className="font-medium">{formData.pagibig || '—'}</span></div>
                          <div><span className="text-gray-500">TIN:</span> <span className="font-medium">{formData.tin || '—'}</span></div>
                        </div>

                        <SectionHeader title="Professional Background Review" />
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          <div><span className="text-gray-500">Job Title:</span> <span className="font-medium">{formData.title || '—'}</span></div>
                          <div><span className="text-gray-500">Status:</span> <span className="font-medium">{formData.status || '—'}</span></div>
                          <div className="col-span-2"><span className="text-gray-500">Education:</span> <span className="font-medium">{formData.education || '—'}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Modal Footer Controls */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl flex-wrap">
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => currentStep === 0 ? setIsModalOpen(false) : setCurrentStep(prev => prev - 1)} 
                      className="px-4 sm:px-6 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      {currentStep === 0 ? 'Cancel' : 'Back'}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveDraft}
                      className="px-4 py-2 text-space-blue font-semibold hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Save as Draft
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-space-blue text-white font-bold px-6 sm:px-8 py-2 rounded-lg hover:bg-mint-green hover:text-space-blue transition-colors shadow-md text-sm sm:text-base"
                  >
                    {currentStep === steps.length - 1 ? 'Submit 201 File' : 'Next Step'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeAccountInfo;