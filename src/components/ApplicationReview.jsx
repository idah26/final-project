/* eslint-disable react/prop-types */
"use client"

import React from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

// Higher-order component to inject router params into class component
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const params = useParams()
    return <Component {...props} params={params} />
  }
  return ComponentWithRouterProp
}

class ApplicationReview extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "details",
      application: {
        id: this.props.params?.id || "OWN-001",
        type: "Vehicle",
        status: "pending",
        priority: "high",
        submissionDate: "2024-12-20",

        applicant: {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+255 123 456 789",
          address: "123 Main Street, Stone Town, Zanzibar",
        },

        transfer: {
          currentOwner: "John Doe",
          newOwner: "Jane Smith",
          reason: "Sale of vehicle",
        },

        vehicle: {
          type: "Car",
          make: "Toyota",
          model: "Corolla",
          year: "2020",
          color: "White",
          plateNumber: "ABC-123",
        },

        payment: {
          method: "mobile_money",
          amount: "50.00",
          reference: "MP123456789",
          status: "verified",
          date: "2024-12-20 09:30:00",
        },

        documents: [
          { name: "Vehicle Registration Certificate", status: "verified" },
          { name: "National ID Copy", status: "verified" },
          { name: "Purchase Agreement", status: "pending" },
          { name: "Insurance Certificate", status: "verified" },
          { name: "Payment Receipt", status: "verified" },
        ],

        description: "Selling my vehicle to a family member. All documents are in order and ready for transfer.",
      },
      reviewComments: "",
      loading: false,
      success: false,
    }
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab })
  }

  handleStatusUpdate = (newStatus) => {
    this.setState({ loading: true })

    setTimeout(() => {
      this.setState({
        application: {
          ...this.state.application,
          status: newStatus,
        },
        success: true,
        loading: false,
      })

      setTimeout(() => this.setState({ success: false }), 3000)
    }, 1000)
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
      case "verified":
        return "bg-green-100 text-green-800"
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
    const { user } = this.context
    const { activeTab, application, reviewComments, loading, success } = this.state

    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      return <Navigate to="/login" replace />
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link
                to="/staff-dashboard"
                className="mr-4 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                ← Back to Dashboard
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
                <p className="text-sm text-gray-500">Application ID: {application.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${this.getPriorityColor(application.priority)}`}
                >
                  {application.priority} priority
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(application.status)}`}>
                  {application.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Application review updated successfully!</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b">
                  <nav className="flex space-x-8 px-6">
                    {["details", "documents", "review"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => this.setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      {/* Applicant Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">👤 Applicant Information</h3>
                        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p className="text-sm text-gray-600">{application.applicant.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-gray-600">{application.applicant.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-gray-600">{application.applicant.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-gray-600">{application.applicant.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Transfer Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">🔄 Transfer Information</h3>
                        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Current Owner</p>
                            <p className="text-sm text-gray-600">{application.transfer.currentOwner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">New Owner</p>
                            <p className="text-sm text-gray-600">{application.transfer.newOwner}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium">Transfer Reason</p>
                            <p className="text-sm text-gray-600">{application.transfer.reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">🚗 Vehicle Information</h3>
                        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Vehicle Type</p>
                            <p className="text-sm text-gray-600">{application.vehicle.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Make & Model</p>
                            <p className="text-sm text-gray-600">
                              {application.vehicle.make} {application.vehicle.model}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Year</p>
                            <p className="text-sm text-gray-600">{application.vehicle.year}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Color</p>
                            <p className="text-sm text-gray-600">{application.vehicle.color}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Plate Number</p>
                            <p className="text-sm text-gray-600">{application.vehicle.plateNumber}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">💳 Payment Information</h3>
                        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Payment Method</p>
                            <p className="text-sm text-gray-600">
                              {application.payment.method === "mobile_money" && "📱 Mobile Money"}
                              {application.payment.method === "bank_transfer" && "🏦 Bank Transfer"}
                              {application.payment.method === "credit_card" && "💳 Credit Card"}
                              {application.payment.method === "cash" && "💵 Cash Payment"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Amount</p>
                            <p className="text-sm text-gray-600">${application.payment.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reference</p>
                            <p className="text-sm text-gray-600">{application.payment.reference}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Payment Status</p>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${this.getPaymentStatusColor(application.payment.status)}`}
                            >
                              {application.payment.status}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium">Payment Date</p>
                            <p className="text-sm text-gray-600">
                              {new Date(application.payment.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">📝 Additional Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">{application.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">📄 Supporting Documents</h3>
                      <p className="text-gray-600">Review and verify submitted documents</p>

                      <div className="space-y-4">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">📄</span>
                                <div>
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <p className="text-sm text-gray-500">PDF • 2.3 MB</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(doc.status)}`}
                                >
                                  {doc.status}
                                </span>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                  👁️ View
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                  📥 Download
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "review" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">💬 Add Review Comments</h3>
                      <p className="text-gray-600">Add your review comments and update application status</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Review Comments</label>
                          <textarea
                            placeholder="Add your review comments here..."
                            value={reviewComments}
                            onChange={(e) => this.setState({ reviewComments: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={() => this.setState({ reviewComments: "" })}
                          disabled={loading}
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          💾 {loading ? "Saving..." : "Save Review"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => this.handleStatusUpdate("approved")}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Approve Application
                  </button>
                  <button
                    onClick={() => this.handleStatusUpdate("rejected")}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Reject Application
                  </button>
                  <button
                    onClick={() => this.handleStatusUpdate("under_review")}
                    disabled={loading}
                    className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ⏱️ Mark Under Review
                  </button>
                  <button
                    onClick={() => this.handleStatusUpdate("pending")}
                    disabled={loading}
                    className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ⚠️ Request More Info
                  </button>
                </div>
              </div>

              {/* Application Summary */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Application ID:</span>
                    <span className="text-sm">{application.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <span className="text-sm">{application.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Submitted:</span>
                    <span className="text-sm">{new Date(application.submissionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Documents:</span>
                    <span className="text-sm">{application.documents.length} files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment:</span>
                    <span className="text-sm">${application.payment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment Status:</span>
                    <span
                      className={`px-1 py-0.5 rounded text-xs font-medium ${this.getPaymentStatusColor(application.payment.status)}`}
                    >
                      {application.payment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Applicant */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Contact Applicant</h3>
                <div className="space-y-3">
                  <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50">
                    📞 Call Applicant
                  </button>
                  <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50">📧 Send Email</button>
                  <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50">
                    💬 Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ApplicationReview)
