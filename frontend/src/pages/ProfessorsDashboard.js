import React from 'react';
import CustomCalendarWidget from '../components/CustomCalendarWidget';
import '../styles/ProfessorsDashboard.css';

const ProfessorsDashboard = () => {
  const professorName = "John Doe"; // This should eventually be dynamic

  return (
    <div className="professor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Καλώς ήρθατε πίσω, {professorName}!</h1>
        <p>Το πρόγραμμά σας με μια ματιά</p>
      </header>

      {/* Main Layout for Calendar and Widgets */}
      <div className="dashboard-layout">
        <main className="main-content">
          {/* Calendar Widget Section */}
          <section id="calendar">
            <CustomCalendarWidget />
          </section>

          {/* Upcoming Classes Widget Section */}
          <section id="upcoming-classes" className="upcoming-classes">
            <h2>Upcoming Classes</h2>
            {/* Dummy list for now - Replace with dynamic data in the future */}
            <ul>
              <li>
                <div>Math - Monday, 10 AM</div>
                <button>View Details</button>
              </li>
              <li>
                <div>Physics - Tuesday, 1 PM</div>
                <button>View Details</button>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfessorsDashboard;
