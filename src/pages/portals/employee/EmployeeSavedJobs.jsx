import { Link } from 'react-router-dom';
import { useDB } from '../../../context/MockDBContext';

const EmployeeSavedJobs = ({ user }) => {
  const { savedJobs, jobs } = useDB();
  const mySaved = savedJobs.filter(s => s.userId === user.id);
  if (mySaved.length === 0) return <div className="text-center py-12 text-gray-500">No saved jobs found.</div>;
  return (
    <div className="space-y-4">
      {mySaved.map(s => {
        const job = jobs.find(j => j.id === s.jobId);
        if (!job) return null;
        return (
          <div key={s.jobId} className="border bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
            <div><h4 className="font-bold text-space-blue text-lg"><Link to={`/careers/${job.id}`} className="hover:text-mint-green">{job.role}</Link></h4><p className="text-gray-500 text-sm">{job.company} &bull; {job.location}</p></div>
            <Link to={`/careers/${job.id}`} className="mt-4 md:mt-0 bg-space-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-mint-green hover:text-space-blue transition-colors">Apply Now</Link>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeSavedJobs;
