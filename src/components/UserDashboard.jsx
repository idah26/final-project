"use client"

import React from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getUserApplications, downloadApplicationDocuments } from "../utils/api"

class UserDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      loading: true,
      error: "",
      searchTerm: "",
      statusFilter: "all",
      selectedApplication: null,
      showDetailsModal: false,
      refreshInterval: null,
      lastUpdated: null,
      notifications: [],
      dataSource: 'unknown', // Track whether data comes from API or localStorage
    }
  }

  componentDidMount() {
    this.loadUserApplications()
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(this.loadUserApplications, 30000)
    this.setState({ refreshInterval })
  }

  componentWillUnmount() {
    // Clear auto-refresh interval
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval)
    }
  }

  loadUserApplications = async () => {
    try {
      const { user } = this.context
      console.log('Loading applications for user:', user)
      
      let applicationsData = []
      
      try {
        // Try to get applications from backend API
        // Use user's email as userId since backend expects email
        const userId = user.email || user.id
        const response = await getUserApplications(user.role, userId)
        console.log('API response:', response)
        applicationsData = response.data || []
        this.setState({ dataSource: 'backend' })
      } catch (apiError) {
        console.log('Backend API failed, checking local storage:', apiError)
        
        // If API fails, check localStorage for applications
        const localApplications = JSON.parse(localStorage.getItem('userApplications') || '[]')
        // Filter by current user (try both email and id)
        const userId = user.email || user.id
        applicationsData = localApplications.filter(app => 
          app.userId === userId || app.submittedBy === userId || app.userId === user?.id
        )
        console.log('Found local applications:', applicationsData)
        this.setState({ dataSource: 'localStorage' })
      }
      
      console.log('Applications data from backend/local:', applicationsData)
      
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
        courtOrderRequired: app.courtOrderRequired || false,
        // Enhanced tracking fields
        timeline: this.generateTimeline(app),
        documents: this.getDocumentStatus(app),
        estimatedCompletion: this.getEstimatedCompletion(app.status),
        lastUpdateDate: app.lastUpdateDate || app.submittedDate || new Date().toISOString(),
        staffAssigned: app.staffAssigned || null,
        reviewNotes: app.reviewNotes || [],
        rawData: app // Keep original data for details modal
      }))
      
      console.log('Transformed applications:', applications)
      
      // Check for status changes to show notifications
      if (this.state.applications.length > 0) {
        this.checkForStatusChanges(this.state.applications, applications)
      }
      
      this.setState({
        applications,
        loading: false,
        error: "",
        lastUpdated: new Date()
      })
      
      // Show notification if using localStorage
      if (this.state.dataSource === 'localStorage' && applications.length > 0) {
        this.setState(prevState => ({
          notifications: [{
            id: Date.now(),
            message: 'Showing locally stored applications (backend not connected)',
            type: 'info',
            timestamp: new Date()
          }, ...prevState.notifications]
        }))
      }
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

  // Enhanced tracking methods
  generateTimeline = (app) => {
    const timeline = [
      {
        step: "Application Submitted",
        date: app.submittedDate || new Date().toISOString(),
        status: "completed",
        description: "Your application has been received"
      }
    ]

    if (app.status !== 'pending') {
      timeline.push({
        step: "Initial Review",
        date: app.reviewStartDate || new Date().toISOString(),
        status: "completed",
        description: "Documents are being verified"
      })
    }

    if (app.status === 'under_review' || app.status === 'approved' || app.status === 'rejected') {
      timeline.push({
        step: "Under Review",
        date: app.underReviewDate || new Date().toISOString(),
        status: "completed",
        description: "Application is under detailed review"
      })
    }

    if (app.status === 'approved') {
      timeline.push({
        step: "Approved",
        date: app.approvedDate || new Date().toISOString(),
        status: "completed",
        description: "Transfer has been approved"
      })
    } else if (app.status === 'rejected') {
      timeline.push({
        step: "Rejected",
        date: app.rejectedDate || new Date().toISOString(),
        status: "rejected",
        description: app.rejectionReason || "Application was rejected"
      })
    } else if (app.status !== 'approved') {
      // Add pending steps
      timeline.push({
        step: "Final Approval",
        date: null,
        status: "pending",
        description: "Awaiting final approval"
      })
    }

    return timeline
  }

  getDocumentStatus = (app) => {
    return [
      {
        name: "Vehicle Registration",
        status: app.vehicleRegStatus || "pending",
        required: true
      },
      {
        name: "Seller ID Copy",
        status: app.sellerIdStatus || "pending",
        required: true
      },
      {
        name: "Buyer ID Copy",
        status: app.buyerIdStatus || "pending",
        required: true
      },
      {
        name: "Sale Agreement",
        status: app.saleAgreementStatus || "pending",
        required: true
      },
      {
        name: "Court Order",
        status: app.courtOrderStatus || "not_required",
        required: app.courtOrderRequired || false
      }
    ]
  }

  getEstimatedCompletion = (status) => {
    const baseDate = new Date()
    switch (status) {
      case 'pending':
        baseDate.setDate(baseDate.getDate() + 7)
        return baseDate.toLocaleDateString()
      case 'under_review':
        baseDate.setDate(baseDate.getDate() + 3)
        return baseDate.toLocaleDateString()
      case 'approved':
      case 'rejected':
        return "Completed"
      default:
        return "Unknown"
    }
  }

  checkForStatusChanges = (oldApps, newApps) => {
    const notifications = []
    
    newApps.forEach(newApp => {
      const oldApp = oldApps.find(app => app.id === newApp.id)
      if (oldApp && oldApp.status !== newApp.status) {
        notifications.push({
          id: Date.now() + Math.random(),
          message: `Application ${newApp.id} status changed to ${newApp.status}`,
          type: newApp.status === 'approved' ? 'success' : newApp.status === 'rejected' ? 'error' : 'info',
          timestamp: new Date()
        })
      }
    })

    if (notifications.length > 0) {
      this.setState(prevState => ({
        notifications: [...notifications, ...prevState.notifications].slice(0, 5) // Keep only last 5 notifications
      }))
      
      // Auto-dismiss notifications after 5 seconds
      setTimeout(() => {
        this.setState(prevState => ({
          notifications: prevState.notifications.filter(n => !notifications.find(newN => newN.id === n.id))
        }))
      }, 5000)
    }
  }

  // Filter and search functions
  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  handleStatusFilterChange = (status) => {
    this.setState({ statusFilter: status })
  }

  getFilteredApplications = () => {
    const { applications, searchTerm, statusFilter } = this.state
    
    return applications.filter(app => {
      const matchesSearch = app.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  // Modal functions
  showApplicationDetails = (application) => {
    this.setState({
      selectedApplication: application,
      showDetailsModal: true
    })
  }

  closeDetailsModal = () => {
    this.setState({
      selectedApplication: null,
      showDetailsModal: false
    })
  }

  dismissNotification = (notificationId) => {
    this.setState(prevState => ({
      notifications: prevState.notifications.filter(n => n.id !== notificationId)
    }))
  }

  handleDownloadDocuments = async (applicationId) => {
    try {
      this.setState({ loading: true })
      await downloadApplicationDocuments(applicationId)
      this.setState({ 
        loading: false,
        notifications: [...this.state.notifications, {
          id: Date.now(),
          message: 'Documents downloaded successfully!',
          type: 'success',
          timestamp: new Date()
        }]
      })
    } catch (error) {
      this.setState({ 
        loading: false,
        notifications: [...this.state.notifications, {
          id: Date.now(),
          message: `Download failed: ${error.message}`,
          type: 'error', 
          timestamp: new Date()
        }]
      })
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
    const { 
      searchTerm, 
      statusFilter, 
      showDetailsModal, 
      selectedApplication, 
      notifications, 
      lastUpdated 
    } = this.state
    
    const filteredApplications = this.getFilteredApplications()

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg shadow-lg max-w-sm ${
                  notification.type === 'success' ? 'bg-green-500 text-white' :
                  notification.type === 'error' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm">{notification.message}</p>
                  <button 
                    onClick={() => this.dismissNotification(notification.id)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">{/* Additional content remains the same */}
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-gray-600">Track your ownership transfer applications and their current status.</p>
              </div>
              <div className="text-right">
                {lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
                <button
                  onClick={this.loadUserApplications}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  disabled={this.state.loading}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
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

          {/* Search and Filter Controls */}
          {filteredApplications.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search applications by ID or vehicle..."
                    value={searchTerm}
                    onChange={this.handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  {['all', 'pending', 'under_review', 'approved', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => this.handleStatusFilterChange(status)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        statusFilter === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
              ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {this.state.applications.length === 0 ? "No Applications Yet" : "No Matching Applications"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {this.state.applications.length === 0 
                        ? "You haven't submitted any ownership transfer applications yet. Applications submitted through the form will appear here."
                        : "No applications match your current search criteria. Try adjusting your filters."
                      }
                    </p>
                    {this.state.applications.length === 0 && (
                      <Link
                        to="/new-application"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        ➕ Submit Your First Application
                      </Link>
                    )}
                  </div>
              ) : (
                <div className="space-y-6">
                  {filteredApplications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{app.type === "Vehicle" ? "🚗" : "🏠"}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{app.asset}</h4>
                          <p className="text-sm text-gray-500">Application ID: {app.id}</p>
                          <p className="text-sm text-gray-500">Submitted: {new Date(app.date).toLocaleDateString()}</p>
                          {app.estimatedCompletion !== "Completed" && (
                            <p className="text-sm text-blue-600">
                              📅 Estimated completion: {app.estimatedCompletion}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${this.getStatusColor(app.status)}`}>
                          {app.status.replace("_", " ").toUpperCase()}
                        </span>
                        {app.staffAssigned && (
                          <p className="text-xs text-gray-500 mt-1">
                            Assigned to: {app.staffAssigned}
                          </p>
                        )}
                      </div>
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Current Status:</h5>
                          <p className="text-sm text-gray-700">{app.statusMessage}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Next Step:</h5>
                          <p className="text-sm text-gray-700">{app.nextStep}</p>
                        </div>
                      </div>
                    </div>

                    {/* Document Status Summary */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">📄 Document Status</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {app.documents.filter(doc => doc.required).map(doc => (
                          <div key={doc.name} className="text-center">
                            <div className={`text-sm p-2 rounded ${
                              doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                              doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status === 'verified' ? '✅' : 
                               doc.status === 'rejected' ? '❌' : '⏳'}
                              <br />
                              <span className="text-xs">{doc.name.split(' ')[0]}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Status */}
                    {app.paymentStatus && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Payment Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${this.getPaymentStatusColor(app.paymentStatus)}`}>
                            {app.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(app.lastUpdateDate).toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <button 
                          onClick={() => this.showApplicationDetails(app)}
                          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        >
                          📄 View Details
                        </button>
                        {app.status === 'approved' && (
                          <button 
                            onClick={() => this.handleDownloadDocuments(app.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            📥 Download Documents
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Application Details - {selectedApplication.id}</h3>
                  <button 
                    onClick={this.closeDetailsModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Application Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">📋 Application Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Application ID:</span>
                        <span className="font-medium">{selectedApplication.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Asset:</span>
                        <span className="font-medium">{selectedApplication.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Owner:</span>
                        <span className="font-medium">{selectedApplication.currentOwner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Owner:</span>
                        <span className="font-medium">{selectedApplication.newOwner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Submitted:</span>
                        <span className="font-medium">{new Date(selectedApplication.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">📊 Progress Summary</h4>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span className="font-medium">{selectedApplication.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${this.getProgressColor(selectedApplication.status)}`}
                          style={{ width: `${selectedApplication.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Current Status:</span>
                        <p className="text-gray-700">{selectedApplication.statusMessage}</p>
                      </div>
                      <div>
                        <span className="font-medium">Next Step:</span>
                        <p className="text-gray-700">{selectedApplication.nextStep}</p>
                      </div>
                      {selectedApplication.estimatedCompletion !== "Completed" && (
                        <div>
                          <span className="font-medium">Estimated Completion:</span>
                          <p className="text-gray-700">{selectedApplication.estimatedCompletion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">📅 Application Timeline</h4>
                  <div className="space-y-4">
                    {selectedApplication.timeline.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === 'completed' ? 'bg-green-500 text-white' :
                          step.status === 'rejected' ? 'bg-red-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {step.status === 'completed' ? '✓' : step.status === 'rejected' ? '✗' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{step.step}</h5>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          {step.date && (
                            <p className="text-xs text-gray-500">{new Date(step.date).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">📄 Document Status</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <span className="font-medium text-sm">{doc.name}</span>
                          {doc.required && <span className="text-red-500 text-xs ml-1">*</span>}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          doc.status === 'not_required' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'verified' ? '✅ Verified' :
                           doc.status === 'rejected' ? '❌ Rejected' :
                           doc.status === 'not_required' ? 'Not Required' :
                           '⏳ Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedApplication.reviewNotes && selectedApplication.reviewNotes.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4">📝 Review Notes</h4>
                    <div className="space-y-3">
                      {selectedApplication.reviewNotes.map((note, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{note.author || 'System'}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(note.date || selectedApplication.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{note.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={this.closeDetailsModal}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {selectedApplication.status === 'approved' && (
                    <button 
                      onClick={() => this.handleDownloadDocuments(selectedApplication.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      📥 Download Documents
                    </button>
                  )}
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default UserDashboard
