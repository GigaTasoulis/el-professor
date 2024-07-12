import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Financials from './pages/Financials';
import StudentProfile from './pages/StudentProfile';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/financials">Financials</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/students/:id" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
