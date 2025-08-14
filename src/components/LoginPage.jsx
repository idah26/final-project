/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import React, { Component } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"


// HOC to pass router params and navigation to class component
function withRouter(Component) {
  return function WrappedComponent(props) {
    const params = useParams()
    const navigate = useNavigate()
    return <Component {...props} params={params} navigate={navigate} />
  }
}

class LoginPage extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { user, getDefaultRoute } = this.context
    console.log("[LoginPage] componentDidUpdate", { justLoggedIn: this.state.justLoggedIn, user })
    const { navigate } = this.props
    
    // Only navigate if justLoggedIn is true
    if (this.state.justLoggedIn && user) {
      const redirectPath = getDefaultRoute()
      navigate(redirectPath, { replace: true })
      // Reset flag so it doesn't keep navigating
      this.setState({ justLoggedIn: false })
    }
  }
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      error: "",
      loading: false,
      justLoggedIn: false,
    }
  }

  handleInputChange = (field, value) => {
    this.setState({ [field]: value })
  }

  getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "staff":
        return "Staff Member"
      case "user":
      default:
        return "User"
    }
  }

  handleSubmit = async (e) => {
    console.log("[LoginPage] handleSubmit called")
    e.preventDefault()
    const { email, password } = this.state
    const { navigate } = this.props
    const { login } = this.context

    if (!email || !password) {
      this.setState({ error: "Please fill in all fields" })
      return
    }

    this.setState({ loading: true, error: "" })

    try {
      // Use the real loginUser API
      const { loginUser } = await import('../utils/api')
      const response = await loginUser(email, password)
      
      // Login successful - use the user data from backend
      login(response.data)
      this.setState({ justLoggedIn: true, loading: false, error: "" })
    } catch (error) {
      // Login failed
      this.setState({ 
        loading: false, 
        error: error.message || "Invalid email or password. Please check your credentials and try again." 
      })
    }
  }

  render() {
    const { email, password, showPassword, error, loading } = this.state
    const selectedRole = this.props.params?.role || "user"

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md">
          <div className="p-6 text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">🛡️</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600">
              Sign in as {this.getRoleDisplayName(selectedRole)} to Online Ownership Change System
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={this.handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => this.handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Signing in..." : `Sign In as ${this.getRoleDisplayName(selectedRole)}`}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Want to login with a different role?{" "}
                <Link to="/" className="text-blue-600 hover:underline">
                  Choose role
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

const LoginPageWithRouter = withRouter(LoginPage)
export default LoginPageWithRouter
