/* eslint-disable no-unused-vars */
"use client"

import React from "react"
import { Link, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

class ApplicationForm extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      formData: {
        transferType: "",
        userName: "",
        userPhone: "",
        userAddress: "",
        userEmail: "",
        currentOwner: "",
        newOwner: "",
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleColor: "",
        vehiclePlateNumber: "",
        description: "",
      },
      loading: false,
      success: false,
      redirectToDashboard: false,
    }
  }

  handleInputChange = (field, value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value,
      },
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true })

    // Simulate form submission
    setTimeout(() => {
      this.setState({ success: true, loading: false })

      // Redirect after success
      setTimeout(() => {
        this.setState({ redirectToDashboard: true })
      }, 2000)
    }, 1500)
  }

  render() {
    const { user } = this.context
    const { formData, loading, success, redirectToDashboard } = this.state

    if (redirectToDashboard) {
      return <Navigate to="/user-dashboard" replace />
    }

    if (success) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">Application Submitted!</h2>
            <p className="text-gray-600">
              Your ownership transfer application has been submitted successfully. You will receive updates via email
              and can track progress in your dashboard.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link
                to="/user-dashboard"
                className="mr-4 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">New Ownership Transfer Application</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Submit Ownership Transfer Request</h2>
              <p className="text-gray-600">Fill out the form below to initiate an ownership transfer process.</p>
            </div>
            <div className="p-6">
              <form onSubmit={this.handleSubmit} className="space-y-8">
                {/* Transfer Type Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transfer Type</h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">What do you want to transfer? *</label>
                    <select
                      value={formData.transferType}
                      onChange={(e) => this.handleInputChange("transferType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select transfer type</option>
                      <option value="vehicle">🚗 Vehicle Transfer</option>
                      <option value="property">🏠 Property Transfer</option>
                    </select>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.userName}
                        onChange={(e) => this.handleInputChange("userName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.userPhone}
                        onChange={(e) => this.handleInputChange("userPhone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Address *</label>
                    <input
                      type="text"
                      placeholder="Enter your full address"
                      value={formData.userAddress}
                      onChange={(e) => this.handleInputChange("userAddress", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.userEmail}
                      onChange={(e) => this.handleInputChange("userEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Ownership Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ownership Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Current Owner *</label>
                      <input
                        type="text"
                        placeholder="Full name of current owner"
                        value={formData.currentOwner}
                        onChange={(e) => this.handleInputChange("currentOwner", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">New Owner *</label>
                      <input
                        type="text"
                        placeholder="Full name of new owner"
                        value={formData.newOwner}
                        onChange={(e) => this.handleInputChange("newOwner", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information - Show only if vehicle transfer is selected */}
                {formData.transferType === "vehicle" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>🚗</span>
                      <span>Vehicle Information</span>
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Vehicle Type *</label>
                        <select
                          value={formData.vehicleType}
                          onChange={(e) => this.handleInputChange("vehicleType", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select vehicle type</option>
                          <option value="car">Car</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="truck">Truck</option>
                          <option value="bus">Bus</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Make *</label>
                        <input
                          type="text"
                          placeholder="e.g., Toyota, Honda, Ford"
                          value={formData.vehicleMake}
                          onChange={(e) => this.handleInputChange("vehicleMake", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Model *</label>
                        <input
                          type="text"
                          placeholder="e.g., Corolla, Civic, Focus"
                          value={formData.vehicleModel}
                          onChange={(e) => this.handleInputChange("vehicleModel", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Color *</label>
                        <input
                          type="text"
                          placeholder="e.g., White, Black, Red"
                          value={formData.vehicleColor}
                          onChange={(e) => this.handleInputChange("vehicleColor", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Plate Number *</label>
                      <input
                        type="text"
                        placeholder="e.g., ABC-123"
                        value={formData.vehiclePlateNumber}
                        onChange={(e) => this.handleInputChange("vehiclePlateNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Additional Description (Optional)</label>
                    <textarea
                      placeholder="Provide any additional details about the transfer..."
                      value={formData.description}
                      onChange={(e) => this.handleInputChange("description", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link to="/user-dashboard" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !formData.transferType}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApplicationForm
