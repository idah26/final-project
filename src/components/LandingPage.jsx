import React from "react";
import { Link } from "react-router-dom";

class LandingPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Online Ownership Change System</h1>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/login/user"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  User Login
                </Link>
                <Link
                  to="/login/staff"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Staff Login
                </Link>
                <Link
                  to="/login/admin"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Streamline Your Ownership Change Process</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A secure, efficient, and transparent platform for transferring ownership of vehicles and properties.
              Reduce paperwork, prevent fraud, and track your applications in real-time.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Login to Your Account →
              </Link>
              <button className="px-8 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50">
                Learn More
              </button>
            </div>
            
            {/* Role-based Quick Access */}
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-4">Quick Access by Role:</p>
              <div className="flex justify-center space-x-6">
                <Link
                  to="/login"
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-green-600 text-xl">👤</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">User Portal</span>
                  <span className="text-xs text-gray-500">Submit Applications</span>
                </Link>
                <Link
                  to="/login"
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Staff Portal</span>
                  <span className="text-xs text-gray-500">Review & Process</span>
                </Link>
                <Link
                  to="/login"
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-purple-600 text-xl">⚙️</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Admin Portal</span>
                  <span className="text-xs text-gray-500">System Management</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-white rounded flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">O</span>
                </div>
                <span className="font-bold">Online Ownership Change System</span>
              </div>
              <p className="text-gray-400 mb-4">A comprehensive digital platform for secure ownership transfers</p>
              <p className="text-gray-400">&copy; 2025 Online Ownership Change System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default LandingPage;
