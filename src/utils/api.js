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
    const response = await fetch(`${API_BASE_URL}/ownership/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to submit application' }))
      throw new Error(error.message || 'Failed to submit application')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

// Staff-specific application functions
export const getStaffApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/staff/applications?t=${Date.now()}`, {
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
  if (status === 'approved') {
    return await approveApplication(applicationId)
  } else if (status === 'rejected') {
    return await rejectApplication(applicationId)
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
    // Use the user ID in the endpoint if provided, otherwise let backend determine from session
    const endpoint = userId 
      ? `${API_BASE_URL}/user/${userId}/applications?t=${Date.now()}`
      : `${API_BASE_URL}/user/applications?t=${Date.now()}`
      
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
    const response = await fetch(`${API_BASE_URL}/admin/applications?t=${Date.now()}`, {
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
