/* eslint-disable react/prop-types */
import React from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

class ProtectedRoute extends React.Component {
  static contextType = AuthContext

  render() {
    const { user, loading, hasPermission } = this.context
    const { children, allowedRoles, element } = this.props
    console.log("[ProtectedRoute]", { user, allowedRoles, children, element })

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return <Navigate to="/login" replace />
    }

    // Use the hasPermission method from AuthContext for role checking
    if (allowedRoles && !hasPermission(allowedRoles)) {
      // Redirect to appropriate dashboard based on user role
      const { getDefaultRoute } = this.context
      return <Navigate to={getDefaultRoute()} replace />
    }

    console.log('[ProtectedRoute] returning children/element', { children, element })
    // Prefer children if present, else element
    return children || element || null
  }
}

export default ProtectedRoute
