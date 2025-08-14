"use client"

import React from "react"
import { Link, Navigate } from "react-router-dom"
import { registerUser } from "../utils/api"


class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPassword: false,
      showConfirmPassword: false,
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationalId: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        staffIdCard: "",
        adminIdCard: "",
      },
      error: "",
      loading: false,
      redirectToLogin: false,
      success: "",
    }
  }

  handleInputChange = (field, value) => {
    // Clear ID card fields when role changes
    if (field === "role") {
      this.setState({
        formData: {
          ...this.state.formData,
          [field]: value,
          staffIdCard: "",
          adminIdCard: "",
        },
      })
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          [field]: value,
        },
      })
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const { formData } = this.state

    if (formData.password !== formData.confirmPassword) {
      this.setState({ error: "Passwords do not match" })
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nationalId || !formData.password) {
      this.setState({ error: "Please fill in all required fields" })
      return
    }

    // Additional validation for staff and admin roles
    if (formData.role === "STAFF" && !formData.staffIdCard) {
      this.setState({ error: "Staff ID card number is required for staff registration" })
      return
    }

    if (formData.role === "ADMIN" && !formData.adminIdCard) {
      this.setState({ error: "Admin ID card number is required for admin registration" })
      return
    }

    this.setState({ loading: true, error: "" })

    try {
      // Prepare data to match your RegisterRequest DTO
      const data = {
        firstName: this.state.formData.firstName,
        lastName: this.state.formData.lastName,
        email: this.state.formData.email,
        phone: this.state.formData.phone,
        nationalId: this.state.formData.nationalId,
        password: this.state.formData.password,
        role: this.state.formData.role,
        staffIdCard: this.state.formData.staffIdCard || null,
        adminIdCard: this.state.formData.adminIdCard || null
      };

      await registerUser(data)
      
      // Show appropriate success message based on role
      if (data.role === "USER") {
        this.setState({ loading: false, redirectToLogin: true })
      } else {
        this.setState({ 
          loading: false, 
          error: "", 
          redirectToLogin: false,
          success: `${data.role.toLowerCase()} registration submitted for approval. You will be notified once verified.`
        })
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.setState({ redirectToLogin: true })
        }, 3000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      this.setState({ 
        loading: false, 
        error: error.message || "Registration failed. Please try again." 
      })
    }
  }

  render() {
    const { showPassword, showConfirmPassword, formData, error, loading, redirectToLogin, success } = this.state

    if (redirectToLogin) {
      return <Navigate to="/login" replace />
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
          <div className="p-6 text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">🛡️</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-600">Join the Online Ownership Change System</p>
          </div>

          <div className="p-6">
            <form onSubmit={this.handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => this.handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => this.handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => this.handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => this.handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">National ID</label>
                  <input
                    placeholder="Enter national ID"
                    value={formData.nationalId}
                    onChange={(e) => this.handleInputChange("nationalId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => this.handleInputChange("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="USER">User</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="text-xs text-gray-500">
                  Choose &ldquo;Staff&rdquo; for administrative privileges or &ldquo;Admin&rdquo; for full system access. Additional verification required for elevated roles.
                </p>
              </div>

              {/* Conditional ID Card Fields */}
              {formData.role === "STAFF" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Staff ID Card Number</label>
                  <input
                    type="text"
                    placeholder="Enter your staff ID card number"
                    value={formData.staffIdCard}
                    onChange={(e) => this.handleInputChange("staffIdCard", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Staff ID card number is required for verification. Registration will be pending approval.
                  </p>
                </div>
              )}

              {formData.role === "ADMIN" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Admin ID Card Number</label>
                  <input
                    type="text"
                    placeholder="Enter your admin ID card number"
                    value={formData.adminIdCard}
                    onChange={(e) => this.handleInputChange("adminIdCard", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Admin ID card number is required for verification. Registration will be pending approval.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => this.handleInputChange("password", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => this.setState({ showPassword: !showPassword })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => this.handleInputChange("confirmPassword", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => this.setState({ showConfirmPassword: !showConfirmPassword })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-600 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterPage
