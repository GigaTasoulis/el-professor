import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import '../styles/Navbar.css'; // Import custom CSS for the sidebar

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <h2 className="sidebar-heading">Elprof.</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/students">
            Students
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/professors">
            Professors
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/calendar">
            Calendar
          </NavLink>
        </li>
        <li className="nav-item mt-auto"> {/* Ensure this is at the bottom */}
          {user ? (
            <button className="btn btn-link nav-link" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
