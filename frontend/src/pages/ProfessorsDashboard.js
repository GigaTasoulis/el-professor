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

      {/* Calendar Widget */}
      <CustomCalendarWidget />
    </div>
  );
};

export default ProfessorsDashboard;
