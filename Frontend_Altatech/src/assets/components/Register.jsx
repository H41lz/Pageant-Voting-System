import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../api.js'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // First try to register with backend
    try {
      const response = await ApiService.register({ email, password })
      if (response.success || response.message) {
        // Backend registration successful
        localStorage.setItem(email, JSON.stringify({ password, lastVote: null }))
        alert("Registered successfully with backend!")
        navigate('/')
        return
      }
    } catch (error) {
      console.log('Backend registration failed, falling back to localStorage:', error.message)
    }
    
    // Fallback to localStorage if backend fails
    if (localStorage.getItem(email)) {
      alert("User already exists")
    } else {
      localStorage.setItem(email, JSON.stringify({ password, lastVote: null }))
      alert("Registered successfully (local storage)")
      navigate('/')
    }
  }

  return (
  <><div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/">Login</a></p>
    </div><footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
        &copy; Altatech Solutions Inc
      </footer></>
 )
}
