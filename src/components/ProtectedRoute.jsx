/* eslint-disable react/prop-types */
import React from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

class ProtectedRoute extends React.Component {
  static contextType = AuthContext

  render() {
    const { user, loading } = this.context
    const { children, allowedRoles } = this.props

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

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />
    }

    return children
  }
}

export default ProtectedRoute
