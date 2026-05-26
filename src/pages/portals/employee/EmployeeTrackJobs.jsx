import { Link } from 'react-router-dom';
import { useDB } from '../../../context/MockDBContext';

const EmployeeTrackJobs = ({ user }) => {
  const { applications, jobs } = useDB();
  const myApps = applications.filter(a => a.userId === user.id);
  if (myApps.length === 0) return <div className="text-center py-12 text-gray-500">You haven&apos;t applied to any jobs yet.</div>;
  return (
    <div className="space-y-4">
      {myApps.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (!job) return null;
        return (
          <div key={app.id} className="border bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-bold text-space-blue text-lg"><Link to={`/careers/${job.id}`} className="hover:text-mint-green">{job.role}</Link></h4>
              <p className="text-gray-500 text-sm">{job.company} &bull; Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <span className={`mt-4 md:mt-0 text-sm px-3 py-1 rounded-full font-bold ${app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{app.status}</span>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeTrackJobs;
