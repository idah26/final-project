/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import React from "react"
import { Link, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"


class ApplicationForm extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    
    // Try to restore saved form data from localStorage
    const savedFormData = localStorage.getItem('applicationFormData')
    const defaultFormData = {
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
      // Add payment fields
      paymentMethod: "",
      paymentAmount: "",
      paymentReference: "",
      paymentStatus: "pending",
      courtOrderId: null, // <-- add this
    }
    
    this.state = {
      formData: savedFormData ? { ...defaultFormData, ...JSON.parse(savedFormData) } : defaultFormData,
      loading: false,
      success: false,
      redirectToDashboard: false,
    }
  }

  handleInputChange = (field, value) => {
    const updatedFormData = {
      ...this.state.formData,
      [field]: value,
    }
    
    this.setState({
      formData: updatedFormData,
    })
    
    // Save to localStorage whenever form data changes
    localStorage.setItem('applicationFormData', JSON.stringify(updatedFormData))
  }

  // Method to save form data before navigating to court order
  saveFormDataAndNavigateToCourtOrder = () => {
    // Save current form data to localStorage
    localStorage.setItem('applicationFormData', JSON.stringify(this.state.formData))
    // Set flag to indicate court order process started
    localStorage.setItem('courtOrderProcessStarted', 'true')
    // Navigate to court order page
    window.location.href = '/court-order-request?returnTo=application'
  }

  // Method to clear saved form data after successful submission
  clearSavedFormData = () => {
    localStorage.removeItem('applicationFormData')
  }

  // Check if user is returning from court order page
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search)
    const courtOrderCompleted = urlParams.get('courtOrderCompleted')
    
    // Also check localStorage for court order completion
    const courtOrderStatus = localStorage.getItem('courtOrderCompleted')
    
    if (courtOrderCompleted === 'true' || courtOrderStatus === 'true') {
      // User is returning from successful court order submission
      // Remove the URL parameter to clean up the URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      
      // Simulate automatic court order file attachment
      const mockCourtOrderFile = new File(['Mock court order content'], 'court_order_document.pdf', {
        type: 'application/pdf'
      })
      
      // Show a success message or update court order status
      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          courtOrderId: 'COURT_ORDER_COMPLETED' // Mark as completed
        },
        courtOrderFile: mockCourtOrderFile // Automatically set the file
      }))
      
      // Save the updated form data to localStorage
      const updatedFormData = {
        ...this.state.formData,
        courtOrderId: 'COURT_ORDER_COMPLETED'
      }
      localStorage.setItem('applicationFormData', JSON.stringify(updatedFormData))
    }
  }

  handleFileChange = (e) => {
    this.setState({ courtOrderFile: e.target.files[0] })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation: If no current owner, court order must be completed or file provided
    if (!this.state.formData.currentOwner && 
        this.state.formData.courtOrderId !== 'COURT_ORDER_COMPLETED' && 
        !this.state.courtOrderFile) {
      alert("Please complete the court order application first when current owner is not available.");
      return;
    }
    
    this.setState({ loading: true })
    // Mock submit: always succeed
    this.setState({ success: true, loading: false })
    
    // Clear saved form data after successful submission
    this.clearSavedFormData()
    
    setTimeout(() => {
      this.setState({ redirectToDashboard: true })
    }, 2000)
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

                {/* Transfer Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transfer Type</h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Type of Transfer *</label>
                    <select
                      value={formData.transferType}
                      onChange={(e) => this.handleInputChange("transferType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select transfer type</option>
                      <option value="vehicle_transfer">Vehicle Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Ownership Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ownership Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Current Owner</label>
                      <input
                        type="text"
                        placeholder="Full name of current owner (if available/known)"
                        value={formData.currentOwner}
                        onChange={(e) => this.handleInputChange("currentOwner", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        Leave empty if current owner is not available or unknown
                      </p>
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

                {/* Vehicle Information */}
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
  placeholder="e.g., Corolla, Civic, Focus, 2022, 4WD"
  value={formData.vehicleModel}
  onChange={(e) => this.handleInputChange("vehicleModel", e.target.value)}
  pattern="[A-Za-z0-9\\s-]+"
  title="Model can contain letters, numbers, spaces, and dashes."
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

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">💳 Payment Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">ℹ️</span>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Processing Fee Required</p>
                        <p>
                          A processing fee is required to complete your ownership transfer application. The fee varies
                          based on the type of transfer.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => this.handleInputChange("paymentMethod", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select payment method</option>
                        <option value="mobile_money">📱 Mobile Payment (M-Pesa, Tigo Pesa)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Processing Fee Amount *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.paymentAmount}
                          onChange={(e) => this.handleInputChange("paymentAmount", e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Payment Transaction ID *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter M-Pesa/Tigo Pesa transaction ID"
                        value={formData.paymentReference}
                        onChange={(e) => this.handleInputChange("paymentReference", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}

                  {/* Payment Instructions */}
                  {formData.paymentMethod && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Payment Instructions:</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          • Send payment to: <strong>+255 123 456 789</strong>
                        </p>
                        <p>• Reference: Your application will be generated after submission</p>
                        <p>• Keep your transaction ID for verification</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">📄 Required Documents</h3>
                  
                  {/* Information box about document requirements */}
                  <div className={`border rounded-lg p-4 mb-4 ${!formData.currentOwner ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-start space-x-2">
                      <span className={!formData.currentOwner ? 'text-yellow-600' : 'text-green-600'}>
                        {!formData.currentOwner ? '⚠️' : 'ℹ️'}
                      </span>
                      <div className={`text-sm ${!formData.currentOwner ? 'text-yellow-800' : 'text-green-800'}`}>
                        <p className="font-medium">
                          {!formData.currentOwner ? 'Court Order Required' : 'No Additional Documents Required'}
                        </p>
                        <p>
                          {!formData.currentOwner 
                            ? 'Since the current owner is not available, you must obtain a court order to proceed with the transfer.'
                            : 'Since the current owner is available, no additional court order documentation is required.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Court Order Section - show only if current owner is NOT available */}
                  {!formData.currentOwner ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center space-x-2">
                        <span>⚖️</span>
                        <span>Court Order Required</span>
                      </h4>
                      <div className="space-y-3">
                        <p className="text-sm text-red-800">
                          You must obtain a court order before proceeding with this transfer application since the current owner is not available.
                        </p>
                        <div className="flex flex-col space-y-2">
                          <button 
                            type="button"
                            onClick={this.saveFormDataAndNavigateToCourtOrder}
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                          >
                            Apply for Court Order First
                          </button>
                          
                          {/* Manual status check button for testing */}
                          <button 
                            type="button"
                            onClick={() => {
                              // Check for court order completion
                              const courtOrderStatus = localStorage.getItem('courtOrderCompleted')
                              if (courtOrderStatus === 'true') {
                                // Simulate automatic court order file attachment
                                const mockCourtOrderFile = new File(['Mock court order content'], 'court_order_document.pdf', {
                                  type: 'application/pdf'
                                })
                                
                                this.setState(prevState => ({
                                  formData: {
                                    ...prevState.formData,
                                    courtOrderId: 'COURT_ORDER_COMPLETED'
                                  },
                                  courtOrderFile: mockCourtOrderFile
                                }))
                                
                                // Update localStorage
                                const updatedFormData = {
                                  ...this.state.formData,
                                  courtOrderId: 'COURT_ORDER_COMPLETED'
                                }
                                localStorage.setItem('applicationFormData', JSON.stringify(updatedFormData))
                                
                                alert('Court order status updated successfully!')
                              } else {
                                alert('No completed court order found. Please complete the court order application first.')
                              }
                            }}
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center text-sm"
                          >
                            ✅ Check Court Order Status
                          </button>
                          
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">After obtaining the court order:</p>
                            {this.state.formData.courtOrderId === 'COURT_ORDER_COMPLETED' ? (
                              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✅</span>
                                  <div>
                                    <p className="text-green-800 font-medium">
                                      Court Order Document Attached Successfully!
                                    </p>
                                    <p className="text-green-700 text-sm">
                                      Document: {this.state.courtOrderFile ? this.state.courtOrderFile.name : 'court_order_document.pdf'}
                                    </p>
                                    <p className="text-green-600 text-xs">
                                      The court order has been automatically attached to your application.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                                <p className="text-gray-700 text-sm">
                                  📋 Court order document will be automatically attached after you complete the court order application process.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
                        <span>✅</span>
                        <span>Ready to Proceed</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        Since the current owner is available, you can proceed with the transfer application without additional court documentation.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link to="/user-dashboard" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.transferType ||
                      !formData.paymentMethod ||
                      !formData.paymentAmount ||
                      !formData.paymentReference ||
                      (!formData.currentOwner && formData.courtOrderId !== 'COURT_ORDER_COMPLETED' && !this.state.courtOrderFile) // Require court order completion if no current owner
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application & Documents"}
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
