import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import '../styles/Navbar.css';

const Navbar = ({ onAddButtonClick }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Sidebar initially visible

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const handleNavClick = (category) => {
    setSelectedCategory(category);
    setIsMenuOpen(false); // Close menu on item click
  };

  const getButtonText = () => {
    switch (selectedCategory) {
      case '/students':
        return '+ Προσθήκη Μαθητή';
      case '/professors':
        return '+ Προσθήκη Καθηγητή';
      case '/calendar':
        return '+ Προσθήκη Μαθήματος';
      case '/dashboard':
        return '+ Όρισε Στόχους';
      default:
        return '';
    }
  };

  const getButtonTextDescription = () => {
    switch (selectedCategory) {
      case '/students':
        return 'Παρακαλώ, οργανώστε τους μαθητές σας μέσω του παρακάτω κουμπιού!';
      case '/professors':
        return 'Παρακαλώ, οργανώστε τους καθηγητές σας μέσω του παρακάτω κουμπιού!';
      case '/calendar':
        return 'Παρακαλώ, οργανώστε την ατζέντα σας μέσω του παρακάτω κουμπιού!';
      case '/dashboard':
        return 'Παρακαλώ, οργανώστε την αρχική σας μέσω του παρακάτω κουμπιού!';
      default:
        return '';
    }
  };

  const handleButtonClick = () => {
    if (typeof onAddButtonClick === 'function') {
      onAddButtonClick(selectedCategory);
    } else {
      console.error('onAddButtonClick is not a function');
    }
  };
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {!isMenuOpen && (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
          alt="Menu"
          className="menu-icon"
          onClick={toggleMenu}
        />
      )}
      <nav className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2 className="sidebar-heading">Elprof.</h2>
        {isMenuOpen && (
          <button className="close-menu" onClick={toggleMenu}>
            &times;
          </button>
        )}
        <ul className="nav flex-column">
          {user.role === 'admin' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard" onClick={() => handleNavClick('/dashboard')}>
                  Αρχική
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/students" onClick={() => handleNavClick('/students')}>
                  Μαθητές
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/professors" onClick={() => handleNavClick('/professors')}>
                  Καθηγητές
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/calendar" onClick={() => handleNavClick('/calendar')}>
                  Ατζέντα
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/classrooms" onClick={() => handleNavClick('/classrooms')}>
                  Αίθουσες/Μαθήματα
                </NavLink>
              </li>
              <div className="add-button-container">
                <p>{getButtonTextDescription()}</p>
                <button className="add-button" onClick={handleButtonClick}>{getButtonText()}</button>
              </div>
            </>
          )}
          {user.role === 'professor' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/professors-dashboard" onClick={() => handleNavClick('/professors-dashboard')}>
                  Αρχική
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/calendar" onClick={() => handleNavClick('/calendar')}>
                  Ατζέντα
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-item mt-auto">
            <a href="/login" className="nav-link logout-link" onClick={handleLogout}>
              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828466.png" alt="Logout Icon" className="logout-icon" />
              Αποσύνδεση
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
