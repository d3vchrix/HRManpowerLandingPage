import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-light-gray min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-space-blue mb-6">About Apex Manpower</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Founded in 2010, Apex Manpower has been at the forefront of the recruitment industry, empowering businesses with world-class talent and providing professionals with career-defining opportunities.
          </p>
        </motion.div>

        {/* Our Story & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-space-blue mb-6 border-l-4 border-mint-green pl-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              What started as a small local recruitment agency in Makati has grown into a global powerhouse. We realized early on that the secret to business growth isn't just about filling seats; it's about finding the exact cultural and technical fit.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, Apex handles deployment for Fortune 500 companies, cutting-edge tech startups, and global logistics leaders. Our proprietary screening process ensures a 98% placement success rate.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-t-4 border-space-blue">
              <h3 className="text-4xl font-bold text-mint-green mb-2">15k+</h3>
              <p className="text-gray-500 font-medium">Careers Launched</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-t-4 border-space-blue">
              <h3 className="text-4xl font-bold text-mint-green mb-2">500+</h3>
              <p className="text-gray-500 font-medium">Partner Companies</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-t-4 border-space-blue">
              <h3 className="text-4xl font-bold text-mint-green mb-2">14</h3>
              <p className="text-gray-500 font-medium">Years of Excellence</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-t-4 border-space-blue">
              <h3 className="text-4xl font-bold text-mint-green mb-2">98%</h3>
              <p className="text-gray-500 font-medium">Retention Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Leadership Team */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-space-blue mb-4">Leadership Team</h2>
          <div className="w-24 h-1 bg-mint-green mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="h-48 bg-space-blue flex items-center justify-center">
                <i className="bi bi-person-circle text-7xl text-mint-green"></i>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-space-blue">Roberto Santos</h3>
                <p className="text-mint-green font-semibold mb-3">CEO & Founder</p>
                <p className="text-sm text-gray-500">20+ years of HR experience transforming recruitment strategies across Asia.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="h-48 bg-space-blue flex items-center justify-center">
                <i className="bi bi-person-circle text-7xl text-mint-green"></i>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-space-blue">Maria Clara</h3>
                <p className="text-mint-green font-semibold mb-3">Chief Operations Officer</p>
                <p className="text-sm text-gray-500">Ensuring seamless deployment and operational excellence for our enterprise clients.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="h-48 bg-space-blue flex items-center justify-center">
                <i className="bi bi-person-circle text-7xl text-mint-green"></i>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-space-blue">James Lee</h3>
                <p className="text-mint-green font-semibold mb-3">Head of Tech Recruitment</p>
                <p className="text-sm text-gray-500">Specializes in hunting top-tier software engineering talent globally.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
