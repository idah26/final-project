/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

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

  login = (email, password, role) => {
    const userData = {
      id: Date.now(),
      email,
      role,
      name: email.split("@")[0],
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("user", JSON.stringify(userData))
    this.setState({ user: userData })

    return userData
  }

  logout = () => {
    localStorage.removeItem("user")
    this.setState({ user: null })
  }

  render() {
    const value = {
      user: this.state.user,
      login: this.login,
      logout: this.logout,
      loading: this.state.loading,
    }

    return <AuthContext.Provider value={value}>{this.props.children}</AuthContext.Provider>
  }
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
