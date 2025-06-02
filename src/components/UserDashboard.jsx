/* eslint-disable react/no-unescaped-entities */
"use client"

import React from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"

class UserDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      applications: [
        {
          id: "OWN-001",
          type: "Vehicle",
          asset: "Toyota Corolla - ABC 123",
          status: "pending",
          date: "2024-12-20",
          progress: 25,
          statusMessage: "Application received and under initial review",
          nextStep: "Document verification in progress",
        },
        {
          id: "OWN-002",
          type: "Property",
          asset: "House - Plot 456, Zanzibar",
          status: "under_review",
          date: "2024-12-15",
          progress: 75,
          statusMessage: "Documents verified, awaiting final approval",
          nextStep: "Final review by senior staff",
        },
        {
          id: "OWN-003",
          type: "Vehicle",
          asset: "Honda Civic - XYZ 789",
          status: "approved",
          date: "2024-12-10",
          progress: 100,
          statusMessage: "Transfer completed successfully",
          nextStep: "Collect new ownership documents",
        },
      ],
    }
  }

  getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getProgressColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "under_review":
        return "bg-blue-500"
      default:
        return "bg-yellow-500"
    }
  }

  render() {
    const { user, logout } = this.context
    const { applications } = this.state

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">🔔</button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">👤</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <button onClick={logout} className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600">Track your ownership transfer applications and their current status.</p>
          </div>

          {/* Quick Action */}
          <div className="mb-8">
            <Link
              to="/new-application"
              className="block w-full p-8 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-center">
                <div className="text-blue-600 text-2xl mb-2">➕</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Submit New Transfer Application</h3>
                <p className="text-blue-600">Start a new ownership transfer process for your vehicle or property</p>
              </div>
            </Link>
          </div>

          {/* Applications Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Your Transfer Applications</h3>
              <p className="text-gray-600">Monitor the status and progress of your ownership transfer requests</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{app.type === "Vehicle" ? "🚗" : "🏠"}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{app.asset}</h4>
                          <p className="text-sm text-gray-500">Application ID: {app.id}</p>
                          <p className="text-sm text-gray-500">Submitted: {new Date(app.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${this.getStatusColor(app.status)}`}>
                        {app.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-medium">{app.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${this.getProgressColor(app.status)}`}
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="mb-2">
                        <h5 className="font-medium text-gray-900 mb-1">Current Status:</h5>
                        <p className="text-sm text-gray-700">{app.statusMessage}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Next Step:</h5>
                        <p className="text-sm text-gray-700">{app.nextStep}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        📄 View Details
                      </button>
                    </div>
                  </div>
                ))}

                {applications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't submitted any transfer applications yet.</p>
                    <Link
                      to="/new-application"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      ➕ Submit Your First Application
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDashboard
