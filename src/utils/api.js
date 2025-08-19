/* eslint-disable no-unused-vars */
// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api'

// Authentication functions
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, password: '***' })
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    console.log('Login response status:', response.status)
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Login error response:', errorText)
      
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { message: errorText || 'Login failed' }
      }
      
      throw new Error(error.message || 'Invalid credentials')
    }

    const data = await response.json()
    console.log('Login successful:', data)
    return { 
      data: data.user || data, 
      redirectPath: data.redirectPath || '/dashboard'
    }
  } catch (error) {
    console.error('Login error details:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const registerUser = async (userData) => {
  try {
    console.log('Sending registration data:', userData)
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }))
      console.error('Registration failed:', errorData)
      throw new Error(errorData.message || 'Registration failed')
    }

    const result = await response.json()
    console.log('Registration successful:', result)
    return result
  } catch (error) {
    console.error('Registration error:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (error) {
    console.warn('Logout request failed:', error)
  }
  localStorage.removeItem('user')
}

// Application management functions
export const submitOwnershipChangeRequest = async (formData) => {
  try {
    console.log('Submitting application data:', formData)
    
    // Use the ApplicationController endpoint that accepts JSON
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })

    console.log('Submit response status:', response.status)
    console.log('Submit response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Submit error response:', errorText)
      
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { message: errorText || 'Failed to submit application' }
      }
      
      throw new Error(error.message || 'Failed to submit application')
    }

    const result = await response.json()
    console.log('Application submitted successfully:', result)
    return result
  } catch (error) {
    console.error('Application submission error:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Staff-specific application functions
export const getStaffApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch applications' }))
      throw new Error(error.message || 'Failed to fetch applications')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const updateApplicationStatus = async (applicationId, status, comments = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: status.toUpperCase(), comments }),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update application status' }))
      throw new Error(error.message || 'Failed to update application status')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Generate new ownership card for approved applications
export const generateOwnershipCard = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/generate-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to generate ownership card' }))
      throw new Error(error.message || 'Failed to generate ownership card')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const approveApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/approve`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to approve application' }))
      throw new Error(error.message || 'Failed to approve application')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const rejectApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/reject`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reject application' }))
      throw new Error(error.message || 'Failed to reject application')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// User-specific application functions
export const getUserApplications = async (userRole, userId) => {
  try {
    // Use the correct backend endpoint structure
    const endpoint = userId 
      ? `${API_BASE_URL}/applications/user/${userId}?t=${Date.now()}`
      : `${API_BASE_URL}/applications?t=${Date.now()}`
      
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      // If the endpoint doesn't exist yet, return empty array instead of throwing error
      if (response.status === 404) {
        console.log('User applications endpoint not found, returning empty array')
        return { data: [] }
      }
      
      const error = await response.json().catch(() => ({ message: 'Failed to fetch user applications' }))
      throw new Error(error.message || 'Failed to fetch user applications')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Return empty array if backend is not running
      console.log('Backend not reachable, returning empty applications array')
      return { data: [] }
    }
    throw error
  }
}

// Admin-specific functions
export const getAllApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch applications' }))
      throw new Error(error.message || 'Failed to fetch applications')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }))
      throw new Error(error.message || 'Failed to fetch users')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create user' }))
      throw new Error(error.message || 'Failed to create user')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update user' }))
      throw new Error(error.message || 'Failed to update user')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete user' }))
      throw new Error(error.message || 'Failed to delete user')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const toggleUserStatus = async (userId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update user status' }))
      throw new Error(error.message || 'Failed to update user status')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Enhanced Application Tracking Functions
export const getApplicationTimeline = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/timeline`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      // Return mock timeline data if endpoint doesn't exist
      if (response.status === 404) {
        return { 
          data: [
            {
              step: "Application Submitted",
              date: new Date().toISOString(),
              status: "completed",
              description: "Your application has been received"
            }
          ]
        }
      }
      
      const error = await response.json().catch(() => ({ message: 'Failed to fetch timeline' }))
      throw new Error(error.message || 'Failed to fetch timeline')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Return mock data if backend is not reachable
      return { 
        data: [
          {
            step: "Application Submitted",
            date: new Date().toISOString(),
            status: "completed",
            description: "Your application has been received"
          }
        ]
      }
    }
    throw error
  }
}

export const getApplicationDocuments = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      // Return mock document data if endpoint doesn't exist
      if (response.status === 404) {
        return { 
          data: [
            { name: "Vehicle Registration", status: "pending", required: true },
            { name: "Seller ID Copy", status: "pending", required: true },
            { name: "Buyer ID Copy", status: "pending", required: true },
            { name: "Sale Agreement", status: "pending", required: true }
          ]
        }
      }
      
      const error = await response.json().catch(() => ({ message: 'Failed to fetch documents' }))
      throw new Error(error.message || 'Failed to fetch documents')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Return mock data if backend is not reachable
      return { 
        data: [
          { name: "Vehicle Registration", status: "pending", required: true },
          { name: "Seller ID Copy", status: "pending", required: true },
          { name: "Buyer ID Copy", status: "pending", required: true },
          { name: "Sale Agreement", status: "pending", required: true }
        ]
      }
    }
    throw error
  }
}

export const updateApplicationStatusEnhanced = async (applicationId, status, notes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes }),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update status' }))
      throw new Error(error.message || 'Failed to update status')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const addApplicationNote = async (applicationId, note) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note }),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to add note' }))
      throw new Error(error.message || 'Failed to add note')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

export const downloadApplicationDocuments = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/download`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download documents' }))
      throw new Error(error.message || 'Failed to download documents')
    }

    // Handle file download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `application-${applicationId}-documents.zip`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    return { success: true }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}
