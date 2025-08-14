/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

const CourtOrderRequest = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    nationalId: '',
    reason: '',
    supportingDocs: null
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Check if user came from application form
  const returnToApplication = new URLSearchParams(location.search).get('returnTo') === 'application'

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      supportingDocs: e.target.files
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock submission - simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Set localStorage flag to indicate court order completion
      localStorage.setItem('courtOrderCompleted', 'true')
      
      // If user came from application form, redirect back with success parameter
      if (returnToApplication) {
        setTimeout(() => {
          navigate('/new-application?courtOrderCompleted=true')
        }, 2000)
      } else {
        // Otherwise redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    }, 1000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Court Order Request Submitted!</h2>
          <p className="mb-6 text-gray-700">
            Your court order request has been submitted successfully. You will receive updates via email and can track progress in your dashboard.
          </p>
          {returnToApplication && (
            <p className="text-blue-600 font-medium">
              Redirecting back to your application form...
            </p>
          )}
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
            {returnToApplication ? (
              <Link
                to="/new-application"
                className="mr-4 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                ← Back to Application
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="mr-4 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                ← Back to Dashboard
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Court Order Application</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          {returnToApplication && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Continuing from Application Form</p>
                  <p>
                    After submitting this court order request, you&apos;ll be redirected back to your application form to continue where you left off.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Court Order Application</h2>
          <p className="mb-6 text-gray-700">
            If the current owner is not available, you are required to apply for a court order to proceed with the ownership transfer. Please fill in the necessary details and submit your request.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your full name" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your address" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">National ID (NIDA) *</label>
              <input 
                type="text" 
                value={formData.nationalId}
                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your National ID number" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Court Order *</label>
              <textarea 
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                rows={4} 
                placeholder="Explain why you need a court order (e.g., current owner is deceased, missing, or uncooperative)..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Supporting Documents (optional)</label>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                multiple 
                accept="application/pdf,image/*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload any supporting documents (death certificate, police report, etc.)
              </p>
            </div>
            
            <div className="flex space-x-4">
              {returnToApplication ? (
                <Link
                  to="/new-application"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-center hover:bg-gray-50"
                >
                  Cancel & Return to Application
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-center hover:bg-gray-50"
                >
                  Cancel
                </Link>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Court Order Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CourtOrderRequest
