/* eslint-disable no-case-declarations */
"use client"

import React from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"

class StaffDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      applications: [
        {
          id: "OWN-001",
          type: "Vehicle",
          asset: "Toyota Corolla - ABC 123",
          applicant: "John Doe",
          status: "pending",
          date: "2024-12-20",
          priority: "high",
          lastUpdated: "2024-12-20 10:30:00",
          assignedTo: "Current User",
        },
        {
          id: "OWN-002",
          type: "Property",
          asset: "House - Plot 456, Zanzibar",
          applicant: "Jane Smith",
          status: "under_review",
          date: "2024-12-19",
          priority: "medium",
          lastUpdated: "2024-12-19 14:15:00",
          assignedTo: "Current User",
        },
        {
          id: "OWN-003",
          type: "Electronics",
          asset: "iPhone 15 Pro - Serial: ABC123",
          applicant: "Mike Johnson",
          status: "pending",
          date: "2024-12-18",
          priority: "low",
          lastUpdated: "2024-12-18 09:45:00",
          assignedTo: "Other Staff",
        },
        {
          id: "OWN-004",
          type: "Vehicle",
          asset: "Honda Civic - XYZ 789",
          applicant: "Sarah Wilson",
          status: "approved",
          date: "2024-12-17",
          priority: "medium",
          lastUpdated: "2024-12-17 16:20:00",
          assignedTo: "Current User",
        },
      ],
      filterStatus: "all",
      filterPriority: "all",
      sortBy: "date",
      sortOrder: "desc",
      success: "",
      error: "",
    }
  }

  // Update application status
  updateApplicationStatus = (applicationId, newStatus) => {
    this.setState({
      applications: this.state.applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: newStatus,
              lastUpdated: new Date().toLocaleString(),
            }
          : app,
      ),
      success: `Application ${applicationId} status updated to ${newStatus.replace("_", " ")}`,
    })

    // Clear success message after 3 seconds
    setTimeout(() => this.setState({ success: "" }), 3000)
  }

  // Quick status update functions
  handleQuickApprove = (applicationId) => {
    if (window.confirm("Are you sure you want to approve this application?")) {
      this.updateApplicationStatus(applicationId, "approved")
    }
  }

  handleQuickReject = (applicationId) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      this.updateApplicationStatus(applicationId, "rejected")
    }
  }

  handleMarkUnderReview = (applicationId) => {
    this.updateApplicationStatus(applicationId, "under_review")
  }

  handleMarkPending = (applicationId) => {
    this.updateApplicationStatus(applicationId, "pending")
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
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
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
              <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">🔔</button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">👤</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Staff</span>
                </div>
                <button onClick={logout} className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  🚪 Logout
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
                            Application ID: {app.id} • Applicant: {app.applicant}
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
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Submitted: {new Date(app.date).toLocaleDateString()}
                      </span>

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
                          <button
                            onClick={() => this.handleMarkPending(app.id)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                          >
                            🔄 Reopen
                          </button>
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

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-500">No applications match your current filters.</p>
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

export default StaffDashboard
