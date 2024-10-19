import React, { useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Professors from './pages/Professors';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import './styles/App.css';
import ClassroomsPage from './pages/ClassroomsPage';
import ProfessorsDashboard from './pages/ProfessorsDashboard';

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
  const { user } = useContext(AuthContext);  // Use location to handle navigation logic
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

  if (!user) {
    // Redirect to login if the user is not authenticated
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar onAddButtonClick={handleAddButtonClick} />
      <div className="main-content">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={user.role === 'admin' ? <Dashboard ref={dashboardRef} /> : <Navigate to="/login" />}
          />
          <Route
            path="/students"
            element={user.role === 'admin' ? <Students /> : <Navigate to="/login" />}
          />
          <Route
            path="/professors"
            element={user.role === 'admin' ? <Professors /> : <Navigate to="/login" />}
          />
          <Route
            path="/classrooms"
            element={user.role === 'admin' ? <ClassroomsPage /> : <Navigate to="/login" />}
          />

          {/* Professor Route */}
          <Route
            path="/professors-dashboard"
            element={user.role === 'professor' ? <ProfessorsDashboard /> : <Navigate to="/login" />}
          />

          {/* Common Route */}
          <Route
            path="/calendar"
            element={<CalendarPage />}
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={user.role === 'admin' ? "/dashboard" : "/professors-dashboard"} />}
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
