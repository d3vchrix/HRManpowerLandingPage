import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EmployeePortal = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="bg-light-gray min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-space-blue p-8 text-center">
            <h2 className="text-3xl font-bold text-mint-green">Employee Portal</h2>
            <p className="text-gray-300 mt-2">Access your 201 file, upload documents, and track your profile.</p>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'login' ? 'text-mint-green border-b-2 border-mint-green' : 'text-gray-500 hover:text-space-blue'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'documents' ? 'text-mint-green border-b-2 border-mint-green' : 'text-gray-500 hover:text-space-blue'}`}
              onClick={() => setActiveTab('documents')}
            >
              Document Upload
            </button>
            <button 
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'profile' ? 'text-mint-green border-b-2 border-mint-green' : 'text-gray-500 hover:text-space-blue'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Tracking
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'login' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input type="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-mint-green focus:border-mint-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-mint-green focus:border-mint-green" />
                  </div>
                  <button type="button" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-space-blue bg-mint-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-green transition-colors">
                    Sign In
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-mint-green transition-colors cursor-pointer">
                  <i className="bi bi-cloud-arrow-up text-5xl text-mint-green mb-4 block"></i>
                  <p className="text-lg font-medium text-space-blue">Drag & drop files here to upload</p>
                  <p className="text-sm text-gray-500 mt-2">Support for PDF, JPG, PNG for your 201 File.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <div className="bg-light-gray p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-space-blue mb-4">Application Status</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-mint-green flex items-center justify-center text-space-blue font-bold"><i className="bi bi-check-lg"></i></div>
                      <div>
                        <p className="font-semibold">Initial Interview</p>
                        <p className="text-sm text-gray-500">Completed on Oct 12</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-mint-green flex items-center justify-center text-space-blue font-bold"><i className="bi bi-check-lg"></i></div>
                      <div>
                        <p className="font-semibold">Document Verification</p>
                        <p className="text-sm text-gray-500">Completed on Oct 15</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">3</div>
                      <div>
                        <p className="font-semibold">Final Deployment</p>
                        <p className="text-sm text-gray-500">Pending final client approval</p>
                      </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeePortal;
