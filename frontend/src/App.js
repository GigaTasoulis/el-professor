import React, { useContext } from 'react';
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
  const { user } = useContext(AuthContext);

  // If user is not logged in, show the Login page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <div className="main-content">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={user.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />}
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
          <Route path="/calendar" element={<CalendarPage />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={user.role === 'admin' ? "/dashboard" : "/professors-dashboard"} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
