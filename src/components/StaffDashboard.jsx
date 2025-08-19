/* eslint-disable no-unused-vars */
"use client"

import React from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getAllApplications, updateApplicationStatus, generateOwnershipCard } from "../utils/api"

class StaffDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      filterStatus: "all",
      filterPriority: "all",
      sortBy: "date",
      sortOrder: "desc",
      loading: true,
      success: "",
      error: "",
    }
  }

  componentDidMount() {
    this.loadApplications()
  }

  loadApplications = async () => {
    try {
      const response = await getAllApplications()
      console.log('Staff applications loaded:', response.data)
      
      const applications = response.data.map(app => ({
        id: app.id,
        applicantName: app.submittedBy || app.applicantName || 'Unknown',
        vehiclePlate: app.vehiclePlateNumber || 'Unknown',
        vehicleMake: app.vehicleMake || 'Unknown',
        vehicleModel: app.vehicleModel || 'Unknown',
        currentOwner: app.currentOwner || 'Unknown',
        newOwner: app.newOwner || 'Unknown',
        status: app.status?.toLowerCase() || 'pending',
        submittedDate: app.submittedDate || new Date().toISOString(),
        paymentStatus: app.paymentStatus || 'pending',
        courtOrderRequired: app.courtOrderRequired || false,
        priority: app.courtOrderRequired ? 'high' : 'medium',
        lastUpdated: app.lastUpdated || new Date().toLocaleString(),
        // Enhanced fields for display
        asset: `${app.vehicleMake || 'Unknown'} ${app.vehicleModel || 'Model'} - ${app.vehiclePlateNumber || 'Unknown'}`,
        applicant: app.submittedBy || app.applicantName || 'Unknown',
        date: app.submittedDate || new Date().toISOString(),
        assignedTo: 'Staff Member', // Default assignment
        type: 'Vehicle' // Default type
      }))
      
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

  // Update application status with backend API call
  updateApplicationStatus = async (applicationId, newStatus, reviewNotes = '') => {
    try {
      // Call backend API to update status
      await updateApplicationStatus(applicationId, newStatus, reviewNotes)
      
      // Update local state
      this.setState((prevState) => ({
        applications: prevState.applications.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus, lastUpdated: new Date().toLocaleString() }
            : app
        ),
        success: `Application ${applicationId} status updated to ${newStatus.replace("_", " ")}`,
      }))
      
      setTimeout(() => this.setState({ success: "" }), 3000)
      
    } catch (error) {
      console.error('Failed to update application status:', error)
      this.setState({
        error: `Failed to update status: ${error.message}`,
      })
      setTimeout(() => this.setState({ error: "" }), 5000)
    }
  }

  // Generate ownership card for approved applications
  generateNewCard = async (applicationId) => {
    try {
      this.setState({ loading: true })
      
      const response = await generateOwnershipCard(applicationId)
      
      this.setState({
        loading: false,
        success: `New ownership card generated successfully for application ${applicationId}!`,
      })
      
      setTimeout(() => this.setState({ success: "" }), 5000)
      
    } catch (error) {
      console.error('Failed to generate ownership card:', error)
      this.setState({
        loading: false,
        error: `Failed to generate ownership card: ${error.message}`,
      })
      setTimeout(() => this.setState({ error: "" }), 5000)
    }
  }

  // Quick status update functions
  handleQuickApprove = async (applicationId) => {
    if (window.confirm("Are you sure you want to approve this application? This will generate a new ownership card.")) {
      await this.updateApplicationStatus(applicationId, "approved", "Application approved by staff")
      
      // Automatically generate ownership card for approved applications
      setTimeout(() => {
        this.generateNewCard(applicationId)
      }, 1000)
    }
  }

  handleQuickReject = async (applicationId) => {
    const reason = window.prompt("Please provide a reason for rejection:")
    if (reason !== null) {
      await this.updateApplicationStatus(applicationId, "rejected", reason || "Application rejected by staff")
    }
  }

  handleMarkUnderReview = async (applicationId) => {
    await this.updateApplicationStatus(applicationId, "under_review", "Application moved to under review")
  }

  handleMarkPending = async (applicationId) => {
    await this.updateApplicationStatus(applicationId, "pending", "Application moved back to pending")
  }

  // Filter and sort functions
  getFilteredApplications = () => {
    let filtered = [...this.state.applications]

    // Filter by status
    if (this.state.filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === this.state.filterStatus)
    }

    // Filter by priority
    if (this.state.filterPriority !== "all") {
      filtered = filtered.filter((app) => app.priority === this.state.filterPriority)
    }

    // Sort applications
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (this.state.sortBy) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        }
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.applicant
          bValue = b.applicant
      }

      if (this.state.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
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

  getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    const { applications, filterStatus, filterPriority, sortBy, sortOrder, success, error } = this.state

    const filteredApplications = this.getFilteredApplications()
    const pendingCount = applications.filter((app) => app.status === "pending").length
    const underReviewCount = applications.filter((app) => app.status === "under_review").length
    const approvedCount = applications.filter((app) => app.status === "approved").length
    const rejectedCount = applications.filter((app) => app.status === "rejected").length

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">👥 Staff</span>
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
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ {success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">Review and process ownership transfer applications.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600">⏱️</span>
                <h3 className="text-lg font-semibold">Pending</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600">📄</span>
                <h3 className="text-lg font-semibold">Under Review</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">{underReviewCount}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600">✅</span>
                <h3 className="text-lg font-semibold">Approved</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-600">❌</span>
                <h3 className="text-lg font-semibold">Rejected</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-purple-600">📊</span>
                <h3 className="text-lg font-semibold">Total</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">{applications.length}</div>
            </div>
          </div>

          {/* Applications Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Ownership Transfer Applications</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">📊 Export Report</button>
              </div>

              {/* Filters and Sorting */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => this.setState({ filterStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Filter by Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => this.setState({ filterPriority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => this.setState({ sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="applicant">Applicant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => this.setState({ sortOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              {this.state.loading ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Loading applications...</p>
                </div>
              ) : this.state.error ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">❌</div>
                  <p className="text-red-600 mb-4">{this.state.error}</p>
                  <button 
                    onClick={this.loadApplications}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600">
                    {this.state.applications.length === 0 
                      ? "There are no applications to review yet." 
                      : "No applications match your current filters."
                    }
                  </p>
                  {this.state.applications.length > 0 && (
                    <button 
                      onClick={() => this.setState({ filterStatus: 'all', filterPriority: 'all' })}
                      className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {app.type === "Vehicle" ? "🚗" : app.type === "Property" ? "🏠" : "📱"}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{app.asset}</h4>
                          <p className="text-sm text-gray-500">
                            Application ID: {app.id} • Submitted by: {app.applicant}
                          </p>
                          <p className="text-sm text-gray-500">
                            Transfer: {app.currentOwner} → {app.newOwner}
                          </p>
                          <p className="text-xs text-gray-400">
                            Last updated: {app.lastUpdated} • Assigned to: {app.assignedTo}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${this.getPriorityColor(app.priority)}`}
                        >
                          {app.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(app.status)}`}>
                          {app.status.replace("_", " ")}
                        </span>
                        {app.courtOrderRequired && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            ⚖️ Court Order Required
                          </span>
                        )}
                        {app.paymentStatus && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${this.getPaymentStatusColor(app.paymentStatus)}`}
                          >
                            💳 {app.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">
                          Submitted: {new Date(app.date).toLocaleDateString()}
                        </span>
                        {app.paymentStatus && (
                          <span className="text-sm text-gray-500 ml-4">
                            💳 Payment Status: {app.paymentStatus}
                          </span>
                        )}
                        {app.courtOrderRequired && (
                          <span className="text-sm text-orange-600 ml-4">
                            ⚖️ Court Order Required
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {/* Quick Action Buttons */}
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() => this.handleMarkUnderReview(app.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                            >
                              📝 Review
                            </button>
                            <button
                              onClick={() => this.handleQuickApprove(app.id)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => this.handleQuickReject(app.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}

                        {app.status === "under_review" && (
                          <>
                            <button
                              onClick={() => this.handleQuickApprove(app.id)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => this.handleQuickReject(app.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => this.handleMarkPending(app.id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                            >
                              ⚠️ Pending
                            </button>
                          </>
                        )}

                        {(app.status === "approved" || app.status === "rejected") && (
                          <>
                            <button
                              onClick={() => this.handleMarkPending(app.id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                            >
                              🔄 Reopen
                            </button>
                            {app.status === "approved" && (
                              <button
                                onClick={() => this.generateNewCard(app.id)}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
                              >
                                🆔 Generate Card
                              </button>
                            )}
                          </>
                        )}

                        <Link
                          to={`/application-review/${app.id}`}
                          className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                        >
                          👁️ Details
                        </Link>
                      </div>
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

export default StaffDashboard
