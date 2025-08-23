import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api.js';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if admin (keep existing hardcoded logic)
    if (email === "admin123" && password === "admin123") {
      localStorage.setItem("currentUser", "admin");
      navigate('/admin');
      return;
    }

    // Try backend login first
    try {
      const response = await ApiService.login({ email, password });
      if (response.token) {
        // Check if user is admin
        if (response.user && response.user.role === 'admin') {
          localStorage.setItem("currentUser", "admin");
          navigate('/admin');
        } else {
          // Regular user login
          localStorage.setItem("currentUser", email);
          navigate('/vote');
        }
        return;
      }
    } catch (error) {
      console.log('Backend login failed, falling back to localStorage:', error.message);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }

    // Fallback to localStorage if backend fails
    const stored = JSON.parse(localStorage.getItem(email) || '{}');
    if (stored && stored.password === password) {
      localStorage.setItem("currentUser", email);
      navigate('/vote');
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="form-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
        
        {/* Admin Login Info */}
        <div className="admin-info">
          <h4>Admin Access:</h4>
          <p><strong>Username:</strong> admin123 | <strong>Password:</strong> admin123</p>
          <p><strong>Email:</strong> admin@pageant.com | <strong>Password:</strong> admin123</p>
        </div>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
        &copy; Altatech Solutions Inc
      </footer>
    </>
  );
}