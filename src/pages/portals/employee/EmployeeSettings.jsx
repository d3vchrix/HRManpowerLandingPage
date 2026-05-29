import { useState } from 'react';
import { useDB } from '../../../context/MockDBContext';

const EmployeeSettings = ({ user, updateProfile }) => {
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

export default EmployeeSettings;
