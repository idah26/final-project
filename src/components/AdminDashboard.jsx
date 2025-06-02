/* eslint-disable no-unused-vars */
"use client"

import React from "react"
import AuthContext from "../context/AuthContext"

class AdminDashboard extends React.Component {
  static contextType = AuthContext

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "overview",
      systemStats: {
        totalUsers: 1250,
        totalApplications: 3420,
        pendingApplications: 45,
        approvedApplications: 3200,
        rejectedApplications: 175,
        activeStaff: 12,
      },
      // User Management State
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@email.com",
          role: "user",
          status: "active",
          phone: "+255 123 456 789",
          nationalId: "123456789",
          joinDate: "2024-01-15",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@email.com",
          role: "staff",
          status: "active",
          phone: "+255 987 654 321",
          nationalId: "987654321",
          joinDate: "2024-02-20",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@email.com",
          role: "user",
          status: "inactive",
          phone: "+255 555 123 456",
          nationalId: "555123456",
          joinDate: "2024-03-10",
        },
      ],
      showAddUserModal: false,
      showEditUserModal: false,
      selectedUser: null,
      newUser: {
        name: "",
        email: "",
        role: "user",
        phone: "",
        nationalId: "",
        password: "",
      },
      // System Settings State
      systemSettings: {
        maintenanceMode: false,
        scheduledMaintenance: "",
        autoBackup: true,
        backupFrequency: "daily",
        maxFileSize: 10,
        sessionTimeout: 30,
        passwordPolicy: "medium",
        maxLoginAttempts: 5,
      },
      // Backup State
      backupHistory: [
        {
          id: 1,
          date: "2024-12-20 02:00:00",
          type: "Automatic",
          size: "2.5 GB",
          status: "completed",
        },
        {
          id: 2,
          date: "2024-12-19 02:00:00",
          type: "Automatic",
          size: "2.4 GB",
          status: "completed",
        },
        {
          id: 3,
          date: "2024-12-18 14:30:00",
          type: "Manual",
          size: "2.4 GB",
          status: "completed",
        },
      ],
      loading: false,
      success: "",
      error: "",
    }
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab })
  }

  // User Management Functions
  handleAddUser = () => {
    this.setState({ showAddUserModal: true })
  }

  handleEditUser = (user) => {
    this.setState({
      showEditUserModal: true,
      selectedUser: user,
      newUser: { ...user },
    })
  }

  handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      this.setState({
        users: this.state.users.filter((user) => user.id !== userId),
        success: "User deleted successfully",
      })
      setTimeout(() => this.setState({ success: "" }), 3000)
    }
  }

  handleSaveUser = () => {
    const { newUser, users, selectedUser } = this.state

    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.nationalId) {
      this.setState({ error: "Please fill in all required fields" })
      return
    }

    this.setState({ loading: true })

    setTimeout(() => {
      if (selectedUser) {
        // Edit existing user
        this.setState({
          users: users.map((user) => (user.id === selectedUser.id ? { ...newUser, id: selectedUser.id } : user)),
          success: "User updated successfully",
        })
      } else {
        // Add new user
        const newUserWithId = {
          ...newUser,
          id: Date.now(),
          joinDate: new Date().toISOString().split("T")[0],
          status: "active",
        }
        this.setState({
          users: [...users, newUserWithId],
          success: "User added successfully",
        })
      }

      this.setState({
        showAddUserModal: false,
        showEditUserModal: false,
        selectedUser: null,
        newUser: {
          name: "",
          email: "",
          role: "user",
          phone: "",
          nationalId: "",
          password: "",
        },
        loading: false,
        error: "",
      })

      setTimeout(() => this.setState({ success: "" }), 3000)
    }, 1000)
  }

  handleToggleUserStatus = (userId) => {
    this.setState({
      users: this.state.users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
      success: "User status updated successfully",
    })
    setTimeout(() => this.setState({ success: "" }), 3000)
  }

  // System Settings Functions
  handleSettingChange = (setting, value) => {
    this.setState({
      systemSettings: {
        ...this.state.systemSettings,
        [setting]: value,
      },
    })
  }

  handleSaveSettings = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        loading: false,
        success: "Settings saved successfully",
      })
      setTimeout(() => this.setState({ success: "" }), 3000)
    }, 1000)
  }

  // Backup Functions
  handleManualBackup = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        type: "Manual",
        size: "2.5 GB",
        status: "completed",
      }
      this.setState({
        backupHistory: [newBackup, ...this.state.backupHistory],
        loading: false,
        success: "Manual backup completed successfully",
      })
      setTimeout(() => this.setState({ success: "" }), 3000)
    }, 3000)
  }

  handleRestoreBackup = (backupId) => {
    if (window.confirm("Are you sure you want to restore from this backup? This action cannot be undone.")) {
      this.setState({ loading: true })
      setTimeout(() => {
        this.setState({
          loading: false,
          success: "System restored successfully",
        })
        setTimeout(() => this.setState({ success: "" }), 3000)
      }, 2000)
    }
  }

  getUserStatusColor = (status) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "staff":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  render() {
    const { user, logout } = this.context
    const {
      activeTab,
      systemStats,
      users,
      showAddUserModal,
      showEditUserModal,
      newUser,
      systemSettings,
      backupHistory,
      loading,
      success,
      error,
    } = this.state

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">🔔</button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">🛡️</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Administrator</span>
                </div>
                <button onClick={logout} className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ {success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Administrator!</h2>
            <p className="text-gray-600">Manage the entire ownership transfer system, users, and applications.</p>
          </div>

          {/* System Stats */}
          <div className="grid md:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600">👥</span>
                <h3 className="text-sm font-medium">Total Users</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-purple-600">📄</span>
                <h3 className="text-sm font-medium">Applications</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">{systemStats.totalApplications.toLocaleString()}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600">⏱️</span>
                <h3 className="text-sm font-medium">Pending</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{systemStats.pendingApplications}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600">✅</span>
                <h3 className="text-sm font-medium">Approved</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {systemStats.approvedApplications.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-600">❌</span>
                <h3 className="text-sm font-medium">Rejected</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">{systemStats.rejectedApplications}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-indigo-600">👨‍💼</span>
                <h3 className="text-sm font-medium">Active Staff</h3>
              </div>
              <div className="text-2xl font-bold text-indigo-600">{systemStats.activeStaff}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {["overview", "users", "applications", "settings", "maintenance"].map((tab) => (
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
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">📊 System Analytics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Application Success Rate</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Average Processing Time</span>
                          <span className="font-medium">2.3 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User Satisfaction</span>
                          <span className="font-medium">4.7/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">System Uptime</span>
                          <span className="font-medium">99.9%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">📈 Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-green-600">✅</span>
                          <div className="text-sm">
                            <p className="font-medium">Application OWN-001 approved</p>
                            <p className="text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-600">👤</span>
                          <div className="text-sm">
                            <p className="font-medium">New user registered: Sarah Wilson</p>
                            <p className="text-gray-500">15 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-yellow-600">⚠️</span>
                          <div className="text-sm">
                            <p className="font-medium">High priority application pending</p>
                            <p className="text-gray-500">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <button
                      onClick={this.handleAddUser}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      ➕ Add User
                    </button>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.phone}</div>
                              <div className="text-sm text-gray-500">ID: {user.nationalId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${this.getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${this.getUserStatusColor(user.status)}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => this.handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => this.handleToggleUserStatus(user.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                {user.status === "active" ? "🚫 Deactivate" : "✅ Activate"}
                              </button>
                              <button
                                onClick={() => this.handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Application Management</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      📊 Export Report
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-gray-500">Application management interface would be implemented here</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">System Settings</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium mb-4">System Configuration</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">System Name</label>
                          <input
                            type="text"
                            defaultValue="SUZA Ownership System"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            value={systemSettings.maxFileSize}
                            onChange={(e) => this.handleSettingChange("maxFileSize", Number.parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                          <input
                            type="number"
                            value={systemSettings.sessionTimeout}
                            onChange={(e) =>
                              this.handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium mb-4">Security Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Password Policy</label>
                          <select
                            value={systemSettings.passwordPolicy}
                            onChange={(e) => this.handleSettingChange("passwordPolicy", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          >
                            <option value="low">Low Security</option>
                            <option value="medium">Medium Security</option>
                            <option value="high">High Security</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Max Login Attempts</label>
                          <input
                            type="number"
                            value={systemSettings.maxLoginAttempts}
                            onChange={(e) =>
                              this.handleSettingChange("maxLoginAttempts", Number.parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={this.handleSaveSettings}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      💾 {loading ? "Saving..." : "Save All Settings"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "maintenance" && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">System Maintenance & Backup</h3>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Maintenance Controls */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium mb-4">🔧 Maintenance Mode</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Maintenance Mode</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.maintenanceMode}
                              onChange={(e) => this.handleSettingChange("maintenanceMode", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Schedule Maintenance</label>
                          <input
                            type="datetime-local"
                            value={systemSettings.scheduledMaintenance}
                            onChange={(e) => this.handleSettingChange("scheduledMaintenance", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                          🔧 Schedule Maintenance
                        </button>
                      </div>
                    </div>

                    {/* Backup Controls */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium mb-4">💾 Backup Management</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Auto Backup</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={systemSettings.autoBackup}
                              onChange={(e) => this.handleSettingChange("autoBackup", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                          <select
                            value={systemSettings.backupFrequency}
                            onChange={(e) => this.handleSettingChange("backupFrequency", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <button
                          onClick={this.handleManualBackup}
                          disabled={loading}
                          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          💾 {loading ? "Creating Backup..." : "Create Manual Backup"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backup History */}
                  <div className="bg-white border rounded-lg">
                    <div className="p-4 border-b">
                      <h4 className="font-medium">📋 Backup History</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {backupHistory.map((backup) => (
                            <tr key={backup.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{backup.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{backup.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{backup.size}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                                  {backup.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">📥 Download</button>
                                <button
                                  onClick={() => this.handleRestoreBackup(backup.id)}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  🔄 Restore
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        {(showAddUserModal || showEditUserModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">{showEditUserModal ? "Edit User" : "Add New User"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => this.setState({ newUser: { ...newUser, name: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => this.setState({ newUser: { ...newUser, email: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => this.setState({ newUser: { ...newUser, phone: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">National ID *</label>
                  <input
                    type="text"
                    value={newUser.nationalId}
                    onChange={(e) => this.setState({ newUser: { ...newUser, nationalId: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter national ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => this.setState({ newUser: { ...newUser, role: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {!showEditUserModal && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => this.setState({ newUser: { ...newUser, password: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() =>
                    this.setState({
                      showAddUserModal: false,
                      showEditUserModal: false,
                      selectedUser: null,
                      newUser: { name: "", email: "", role: "user", phone: "", nationalId: "", password: "" },
                      error: "",
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={this.handleSaveUser}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : showEditUserModal ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default AdminDashboard
