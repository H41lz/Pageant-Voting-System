import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api.js';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if admin (keep existing hardcoded logic)
    if (email === "admin123" && password === "admin123") {
      localStorage.setItem("currentUser", "admin");
      navigate('/admin');
      return;
    }
  }
  return (
    <>
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
        &copy; Altatech Solutions Inc
      </footer>
    </>
  );
}
