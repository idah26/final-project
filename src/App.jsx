import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import LandingPage from "./components/LandingPage"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import UserDashboard from "./components/UserDashboard"
import StaffDashboard from "./components/StaffDashboard"
import AdminDashboard from "./components/AdminDashboard"
import ApplicationForm from "./components/ApplicationForm"
import ApplicationReview from "./components/ApplicationReview"
import ProtectedRoute from "./components/ProtectedRoute"

class App extends React.Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/:role" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-application"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <ApplicationForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/application-review/:id"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ApplicationReview />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    )
  }
}

export default App
