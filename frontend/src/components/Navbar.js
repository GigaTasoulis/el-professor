import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import '../styles/Navbar.css';
import '../styles/Navbar.css';

const Navbar = ({ onAddButtonClick }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.pathname);
  

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const handleNavClick = (category) => {
    setSelectedCategory(category);
  };

  const getButtonText = () => {
    switch (selectedCategory) {
      case '/students':
        return '+  Add Student';
      case '/professors':
        return '+ Add Professor';
      case '/calendar':
        return '+  Add Event';
      case '/dashboard':
        return '+ Set Goals';
      case '/classrooms':
        return ''; 
      default:
        return '';
    }
  };

  const getButtonTextDescription = () => {
    switch (selectedCategory) {
      case '/students':
        return 'Please, organize your students through button below!';
      case '/professors':
        return 'Please, organize your professors through button below!';
      case '/calendar':
        return 'Please, organize your events through button below!';
      case '/dashboard':
        return 'Please, set your goals through the button below!';
      case '/classrooms':
        return ''; // Add a description if necessary
      default:
        return '';
    }
  };

  const handleButtonClick = () => {
    onAddButtonClick(selectedCategory);
  };

  return (
    <nav className="sidebar">
      <h2 className="sidebar-heading">Elprof.</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard" onClick={() => handleNavClick('/dashboard')}>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/students" onClick={() => handleNavClick('/students')}>
            Students
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/professors" onClick={() => handleNavClick('/professors')}>
            Professors
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/calendar" onClick={() => handleNavClick('/calendar')}>
            Calendar
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/classrooms" onClick={() => handleNavClick('/classrooms')}>
            Classrooms
          </NavLink>
        </li>
        <div className="add-button-container">
          <p>{getButtonTextDescription()}</p>
          <button className="add-button" onClick={handleButtonClick}>{getButtonText()}</button>
        </div>
        <li className="nav-item mt-auto">
          {user ? (
            <a href="/login" className="nav-link logout-link" onClick={handleLogout}>
              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828466.png" alt="Logout Icon" className="logout-icon" />
              Logout
            </a>
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
