import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <div className="login-background"></div>
        <div className="image-text top">El Prof.</div>
        <div className="image-text bottom">
          <div className="bottom-bold">We help you to organize your business</div>
          <div className="bottom-normal">Start for free now</div>
        </div>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Username</label>
            <input
              type="text"
              className="login-form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              className="login-form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

//gg//