/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import React from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getUserApplications } from "../utils/api"

class UserDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      loading: true,
      error: "",
    }
  }

  componentDidMount() {
    this.loadUserApplications()
  }

  loadUserApplications = async () => {
    try {
      const { user } = this.context
      console.log('Loading applications for user:', user)
      
      const response = await getUserApplications(user.role, user.id)
      console.log('API response:', response)
      
      // Handle case where response.data might be null or undefined
      const applicationsData = response.data || []
      
      // Transform the application data for display
      const applications = applicationsData.map(app => ({
        id: `OWN-${String(app.id).padStart(3, '0')}`,
        type: "Vehicle",
        asset: `${app.vehicleMake || 'Unknown'} ${app.vehicleModel || 'Model'} - ${app.vehiclePlateNumber || 'Unknown'}`,
        status: app.status || 'pending',
        date: app.submittedDate || new Date().toISOString(),
        progress: this.getProgressByStatus(app.status || 'pending'),
        statusMessage: this.getStatusMessage(app.status || 'pending'),
        nextStep: this.getNextStep(app.status || 'pending'),
        currentOwner: app.currentOwner || 'Not specified',
        newOwner: app.newOwner || 'Not specified',
        paymentStatus: app.paymentStatus || 'pending',
        courtOrderRequired: app.courtOrderRequired || false
      }))
      
      console.log('Transformed applications:', applications)
      
      this.setState({
        applications,
        loading: false,
        error: ""
      })
    } catch (err) {
      console.error('Failed to load applications:', err)
      this.setState({
        error: `Failed to load applications: ${err.message}`,
        loading: false,
        applications: []
      })
    }
  }

  getProgressByStatus = (status) => {
    switch (status) {
      case 'pending': return 25
      case 'under_review': return 50
      case 'approved': return 100
      case 'rejected': return 0
      default: return 0
    }
  }

  getStatusMessage = (status) => {
    switch (status) {
      case 'pending': return "Application received and under initial review"
      case 'under_review': return "Documents verified, awaiting final approval"
      case 'approved': return "Transfer completed successfully"
      case 'rejected': return "Application rejected. Please contact support."
      default: return "Status unknown"
    }
  }

  getNextStep = (status) => {
    switch (status) {
      case 'pending': return "Document verification in progress"
      case 'under_review': return "Final review by senior staff"
      case 'approved': return "Collect new ownership documents"
      case 'rejected': return "Contact support for assistance"
      default: return ""
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

  getPaymentStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">👤 User</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">🔔</button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">👤</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <button onClick={logout} className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Logout
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
              {this.state.loading ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Loading your applications...</p>
                </div>
              ) : this.state.error ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">❌</div>
                  <p className="text-red-600 mb-4">{this.state.error}</p>
                  <button 
                    onClick={this.loadUserApplications}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't submitted any ownership transfer applications yet. 
                    Start by creating your first application.
                  </p>
                  <Link
                    to="/new-application"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    ➕ Submit Your First Application
                  </Link>
                </div>
              ) : (
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDashboard
