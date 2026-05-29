import { useState, useRef } from 'react';
import { useDB } from '../../../context/MockDBContext';

const EmployeeAccountInfo = ({ user, updateProfile }) => {
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

export default EmployeeAccountInfo;
