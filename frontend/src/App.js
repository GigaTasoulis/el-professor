import React, { useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Professors from './pages/Professors';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <MainContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

const MainContent = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const dashboardRef = useRef(null);

  const handleAddButtonClick = (selectedCategory) => {
    if (selectedCategory === '/dashboard' && dashboardRef.current) {
      dashboardRef.current.openGoalsModal();
    } else {
      switch (selectedCategory) {
        case '/students':
          document.querySelector('#open-student-modal-btn').click();
          break;
        case '/professors':
          document.querySelector('#open-professor-modal-btn').click();
          break;
        case '/calendar':
          document.querySelector('#open-calendar-modal-btn').click();
          break;
        default:
          break;
      }
    }
  };

  if (location.pathname === '/login') {
    return <Login />;
  }

  return (
    <>
      {user && <Navbar onAddButtonClick={handleAddButtonClick} />}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard ref={dashboardRef} />} />
          <Route path="/students" element={<Students />} />
          <Route path="/professors" element={<Professors />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
