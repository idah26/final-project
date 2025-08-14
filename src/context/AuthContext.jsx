/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { logoutUser } from "../utils/api"

const AuthContext = React.createContext()

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      loading: true,
    }
  }

  componentDidMount() {
    // Check if user is logged in on app start
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        this.setState({ user: JSON.parse(userData), loading: false })
      } catch (error) {
        localStorage.removeItem("user")
        this.setState({ loading: false })
      }
    } else {
      this.setState({ loading: false })
    }
  }

  // Role hierarchy - higher roles inherit lower role permissions
  roleHierarchy = {
    admin: ['admin', 'staff', 'user'],
    staff: ['staff', 'user'],
    user: ['user']
  }

  login = (userObj) => {
    // Accept user object from backend login response
    // Store user data in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userObj))
    this.setState({ user: userObj })
    return userObj
  }

  logout = async () => {
    try {
      await logoutUser() // This will handle token removal
    } catch (error) {
      console.warn('Logout request failed:', error)
    }
    
    // Clean up local state
    localStorage.removeItem("user") // Remove any old user data
    this.setState({ user: null })
  }

  // Check if user has permission for required roles
  hasPermission = (requiredRoles) => {
    if (!this.state.user || !this.state.user.role) return false
    
    const userRole = this.state.user.role.toLowerCase()
    const userPermissions = this.roleHierarchy[userRole] || []
    const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    
    return required.some(role => userPermissions.includes(role.toLowerCase()))
  }

  // Get redirect path based on user role
  getDefaultRoute = () => {
    if (!this.state.user || !this.state.user.role) return '/login'
    
    const role = this.state.user.role.toLowerCase()
    switch(role) {
      case 'admin':
        return '/admin-dashboard'
      case 'staff':
        return '/staff-dashboard'
      case 'user':
      default:
        return '/user-dashboard'
    }
  }

  render() {
    const value = {
      user: this.state.user,
      login: this.login,
      logout: this.logout,
      loading: this.state.loading,
      hasPermission: this.hasPermission,
      getDefaultRoute: this.getDefaultRoute,
    }

    return <AuthContext.Provider value={value}>{this.props.children}</AuthContext.Provider>
  }
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
