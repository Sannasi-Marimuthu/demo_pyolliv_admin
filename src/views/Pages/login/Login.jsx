import React, { useState } from 'react'
import { api } from '../../../Axios/axios'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const login = async (e) => {
    e.preventDefault() // Prevent form reload

    const loginData = {
      type: 'Logintype',
      Name: username,
      Password: password,
    }

    try {
      const response = await axios.post('http://164.52.195.176:4500/api/post', loginData)
      console.log('LoginDetails', response)
      toast.success('Login successful')

      sessionStorage.setItem('propertyId', response.data.propertyId)
      sessionStorage.setItem('Email', response.data.Email)
      sessionStorage.setItem('Admin', response.data.Admin)
      sessionStorage.setItem('login', 'Success')
      navigate(0)
    } catch (error) {
      // console.log(error.response.data.message)
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div>
      <main className="loginmain">
        <form className="form" onSubmit={login}>
          <h2>Login</h2>
          <div className="flex-column">
            <label htmlFor="email">Email</label>
          </div>
          <div className="inputForm">
            <input
              style={{ paddingLeft: '15px' }}
              type="email"
              id="email"
              className="input"
              placeholder="Enter your Email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="flex-column">
            <label htmlFor="password">Password</label>
          </div>
          <div className="inputForm">
            <input
              style={{ paddingLeft: '15px' }}
              type="password"
              id="password"
              className="input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex-row">
            <input type="checkbox" id="remember-me" style={{ marginRight: '5px' }} />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" onClick={login} className="button-submit">
            Sign In
          </button>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Zoom}
          />
        </form>
      </main>
    </div>
  )
}

export default Login
