import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-light-gray min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-space-blue text-white overflow-hidden py-16 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-opacity-20 bg-mint-green transform -skew-y-12 origin-top-left z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-mint-green"
          >
            Empower Your Workforce
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 max-w-3xl mx-auto text-gray-300"
          >
            Apex Manpower connects highly skilled professionals with elite organizations, driving growth and success.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-2 sm:gap-4"
          >
            {!user && (
              <Link to="/login" className="bg-mint-green text-space-blue px-5 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-white transition-colors duration-300 shadow-lg flex items-center gap-2 text-xs sm:text-sm">
                Get Started Today
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
            Trusted by Companies Under Apex
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-2xl font-bold text-space-blue"><i className="bi bi-apple"></i> TechNova</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-space-blue"><i className="bi bi-globe"></i> GlobalLogistics</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-space-blue"><i className="bi bi-building"></i> BuildCorp</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-space-blue"><i className="bi bi-h-square"></i> MediCare Inc.</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-space-blue"><i className="bi bi-cup-hot"></i> RoastCafe</div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Core Values */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-space-blue mb-4">Our Purpose</h2>
            <div className="w-24 h-1 bg-mint-green mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-mint-green">
              <div className="text-4xl text-space-blue mb-4"><i className="bi bi-bullseye"></i></div>
              <h3 className="text-2xl font-bold text-space-blue mb-4">Mission</h3>
              <p className="text-gray-600">To bridge the gap between extraordinary talent and industry-leading companies by providing seamless, reliable, and innovative manpower solutions.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
              <div className="text-4xl text-space-blue mb-4"><i className="bi bi-eye"></i></div>
              <h3 className="text-2xl font-bold text-space-blue mb-4">Vision</h3>
              <p className="text-gray-600">To be the globally recognized leader in manpower services, known for transforming businesses and empowering careers worldwide.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500">
              <div className="text-4xl text-space-blue mb-4"><i className="bi bi-gem"></i></div>
              <h3 className="text-2xl font-bold text-space-blue mb-4">Core Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li><i className="bi bi-check2 text-mint-green mr-2"></i> Integrity & Transparency</li>
                <li><i className="bi bi-check2 text-mint-green mr-2"></i> Excellence in Service</li>
                <li><i className="bi bi-check2 text-mint-green mr-2"></i> Employee Empowerment</li>
                <li><i className="bi bi-check2 text-mint-green mr-2"></i> Innovation</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-space-blue mb-12">Why Choose Apex?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-mint-green text-5xl mb-4"><i className="bi bi-shield-check"></i></div>
              <h3 className="text-xl font-bold text-space-blue mb-2">Verified Talent</h3>
              <p className="text-gray-600">Every candidate goes through a rigorous screening process to ensure top quality.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-mint-green text-5xl mb-4"><i className="bi bi-lightning-charge"></i></div>
              <h3 className="text-xl font-bold text-space-blue mb-2">Fast Deployment</h3>
              <p className="text-gray-600">Get the staff you need exactly when you need them, without delays.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-mint-green text-5xl mb-4"><i className="bi bi-graph-up-arrow"></i></div>
              <h3 className="text-xl font-bold text-space-blue mb-2">Business Growth</h3>
              <p className="text-gray-600">Focus on your core business while we handle your manpower requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-space-blue text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-mint-green">What Our Partners Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="flex text-mint-green mb-4">
                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
              </div>
              <p className="text-gray-300 italic mb-6">"Apex Manpower completely transformed our hiring process. We requested 50 warehouse staff and they were deployed within a week. Outstanding service!"</p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Sarah+J&background=random" alt="Sarah" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-bold">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-400">Operations Director, GlobalLogistics</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="flex text-mint-green mb-4">
                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
              </div>
              <p className="text-gray-300 italic mb-6">"As an IT consulting firm, finding the right React developers was tough. Apex brought us top-tier talent that fit our culture perfectly."</p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Mark+T&background=random" alt="Mark" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-bold">Mark Thompson</h4>
                  <p className="text-sm text-gray-400">CTO, TechNova</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="flex text-mint-green mb-4">
                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
              </div>
              <p className="text-gray-300 italic mb-6">"I applied through Apex and within 3 days, I was interviewed and hired! The employee portal makes tracking everything so easy."</p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=David+R&background=random" alt="David" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-bold">David Ramirez</h4>
                  <p className="text-sm text-gray-400">Deployed Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-mint-green text-space-blue text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Workforce?</h2>
          <p className="text-xl mb-10 text-gray-800">Whether you're looking to hire top talent or find your dream job, Apex Manpower is here to connect you.</p>
          {!user && (
            <Link to="/login" className="inline-block bg-space-blue text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 hover:scale-105 transition-all shadow-xl">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
