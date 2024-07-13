import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage'; // Update this line
import Financials from './pages/Financials';
import StudentProfile from './pages/StudentProfile';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
