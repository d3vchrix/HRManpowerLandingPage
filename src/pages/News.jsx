import { motion } from 'framer-motion';

const News = () => {
  const dummyNews = [
    {
      id: 1,
      title: "Apex Manpower Expands to the Global Tech Market",
      date: "October 15, 2026",
      category: "Company Update",
      image: "bi-globe",
      excerpt: "In a monumental move, Apex Manpower has announced its new division focused exclusively on supplying remote tech talent to Silicon Valley startups and European enterprise giants."
    },
    {
      id: 2,
      title: "Q3 Hiring Trends: Healthcare and Logistics Lead the Surge",
      date: "September 28, 2026",
      category: "Industry Insights",
      image: "bi-graph-up-arrow",
      excerpt: "Our latest data shows a massive 45% increase in demand for warehouse managers and registered nurses. Find out what this means for job seekers in Q4."
    },
    {
      id: 3,
      title: "Apex Recognized as 'Best Recruitment Agency 2026'",
      date: "August 12, 2026",
      category: "Awards",
      image: "bi-trophy",
      excerpt: "The National HR Association has awarded Apex Manpower the top spot for its innovative employee tracking portal and outstanding 98% placement success rate."
    },
    {
      id: 4,
      title: "Upcoming Event: Mega Job Fair in Metro Manila",
      date: "August 01, 2026",
      category: "Events",
      image: "bi-calendar-event",
      excerpt: "Join us this coming weekend at the SMX Convention Center! Over 50 partner companies will be conducting on-the-spot interviews for 2,000+ open roles."
    }
  ];

  return (
    <div className="bg-light-gray min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-space-blue mb-4">News & Updates</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest industry trends, hiring events, and Apex Manpower announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {dummyNews.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="sm:w-1/3 bg-space-blue flex items-center justify-center p-8 group-hover:bg-mint-green transition-colors">
                <i className={`bi ${item.image} text-6xl text-white group-hover:text-space-blue transition-colors`}></i>
              </div>
              <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-mint-green tracking-wider">{item.category}</span>
                  <span className="text-xs text-gray-400"><i className="bi bi-clock mr-1"></i>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-space-blue mb-3 group-hover:text-mint-green transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.excerpt}</p>
                <div className="mt-auto">
                  <span className="text-space-blue font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Full Story <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-transparent border-2 border-space-blue text-space-blue px-8 py-3 rounded-full font-semibold hover:bg-space-blue hover:text-white transition-colors duration-300">
            Load More Articles
          </button>
        </div>

      </div>
    </div>
  );
};

export default News;
