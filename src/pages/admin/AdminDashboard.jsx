import { motion } from 'framer-motion';

const MOCK_STATS = [
  { label: 'Deployed Employees', value: 248, icon: 'bi-person-check-fill', color: 'border-mint-green', textColor: 'text-mint-green', delta: '+12 this month' },
  { label: 'Active Client Companies', value: 34, icon: 'bi-buildings-fill', color: 'border-blue-500', textColor: 'text-blue-500', delta: '+2 this month' },
  { label: 'Pending Job Posts', value: 17, icon: 'bi-briefcase-fill', color: 'border-yellow-500', textColor: 'text-yellow-500', delta: '5 need review' },
  { label: 'Open Tickets', value: 9, icon: 'bi-ticket-detailed-fill', color: 'border-red-500', textColor: 'text-red-500', delta: '3 high priority' },
];

const MOCK_ACTIVITY = [
  { id: 1, icon: 'bi-person-fill-up', color: 'bg-mint-green text-space-blue', text: 'Juan dela Cruz assigned to NovaTech Corp.', time: '2 mins ago' },
  { id: 2, icon: 'bi-ticket-fill', color: 'bg-red-100 text-red-600', text: 'New Ticket #109 opened — Payroll discrepancy reported.', time: '18 mins ago' },
  { id: 3, icon: 'bi-briefcase-fill', color: 'bg-yellow-100 text-yellow-700', text: 'Job Post "Warehouse Supervisor" approved for GlobalGoods Inc.', time: '1 hr ago' },
  { id: 4, icon: 'bi-person-plus-fill', color: 'bg-blue-100 text-blue-700', text: 'Maria Santos added as new Employee (Unassigned).', time: '3 hrs ago' },
  { id: 5, icon: 'bi-building-fill-check', color: 'bg-purple-100 text-purple-700', text: 'New client company "Apex Logistics" onboarded.', time: '5 hrs ago' },
  { id: 6, icon: 'bi-check2-circle', color: 'bg-green-100 text-green-700', text: 'Ticket #105 resolved — Workplace incident closed.', time: 'Yesterday' },
  { id: 7, icon: 'bi-file-earmark-pdf-fill', color: 'bg-gray-100 text-gray-600', text: 'Monthly deployment report generated for May 2026.', time: 'Yesterday' },
];

const MOCK_TOP_COMPANIES = [
  { name: 'NovaTech Corp.', deployed: 54, industry: 'Technology' },
  { name: 'GlobalGoods Inc.', deployed: 41, industry: 'Logistics' },
  { name: 'BuildRight PH', deployed: 38, industry: 'Construction' },
  { name: 'Apex Logistics', deployed: 27, industry: 'Supply Chain' },
];

const AdminDashboard = () => (
  <div className="space-y-8">
    {/* Metric Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {MOCK_STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${s.color} flex flex-col gap-2`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <i className={`bi ${s.icon} text-2xl ${s.textColor}`}></i>
          </div>
          <p className="text-4xl font-extrabold text-space-blue">{s.value}</p>
          <p className="text-xs text-gray-400">{s.delta}</p>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Recent Activity Feed */}
      <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-space-blue mb-5 flex items-center gap-2">
          <i className="bi bi-activity text-mint-green"></i> Recent Activity
        </h3>
        <ol className="relative border-l-2 border-gray-100 space-y-6 ml-2">
          {MOCK_ACTIVITY.map((a) => (
            <li key={a.id} className="relative pl-8">
              <span className={`absolute -left-4 w-7 h-7 rounded-full flex items-center justify-center text-xs ${a.color} shadow`}>
                <i className={`bi ${a.icon}`}></i>
              </span>
              <p className="text-sm font-medium text-gray-800">{a.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Top Client Companies */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
        <h3 className="text-lg font-bold text-space-blue mb-5 flex items-center gap-2">
          <i className="bi bi-bar-chart-fill text-blue-500"></i> Top Clients by Deployment
        </h3>
        <div className="space-y-4 flex-grow">
          {MOCK_TOP_COMPANIES.map((c, i) => (
            <div key={c.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-space-blue">{c.name}</span>
                <span className="text-gray-500 font-bold">{c.deployed}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-mint-green"
                  style={{ width: `${(c.deployed / 54) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{c.industry}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-400">Total deployed across <span className="font-bold text-space-blue">34</span> companies</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
