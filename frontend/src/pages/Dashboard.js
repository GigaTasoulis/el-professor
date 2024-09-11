import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Modal from '../components/Modal';
import '../styles/Dashboard.css';
import { Button } from '@mui/material';
import DashboardCalendar from '../components/DashboardCalendar';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = forwardRef((props, ref) => {
  const [classes, setClasses] = useState([]); // Αλλαγή σε classes
  const [students, setStudents] = useState([]);
  const [studentGoal, setStudentGoal] = useState(100);
  const [revenueGoal, setRevenueGoal] = useState(10000);
  const [hoursGoal, setHoursGoal] = useState(1000);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [viewMode, setViewMode] = useState('year');
  const [displayStats, setDisplayStats] = useState(false);

  useEffect(() => {
    if (displayStats) {
      fetchStats(); 
    }
  }, [selectedYear, selectedMonth, selectedWeek, displayStats]);

  useImperativeHandle(ref, () => ({
    openGoalsModal: () => setModalIsOpen(true),
  }));

  // Ενιαία λειτουργία για fetch στατιστικών (μαθημάτων και μαθητών)
  const fetchStats = async () => {
    try {
      let params = {};
  
      if (selectedYear && !selectedMonth && !selectedWeek) {
        params = { year: selectedYear.format('YYYY') };
      } else if (selectedYear && selectedMonth && !selectedWeek) {
        params = { year: selectedYear.format('YYYY'), month: selectedMonth.format('MM') };
      } else if (selectedYear && selectedMonth && selectedWeek) {
        params = {
          year: selectedYear.format('YYYY'),
          month: selectedMonth.format('MM'),
          week: selectedWeek.map((date) => date.format('YYYY-MM-DD')).join(',')
        };
      }
  
      const response = await axios.get('http://localhost:5000/api/dashboard/stats', { params });
      const { classes, students } = response.data; // Ανάκτηση των classes και students

      setClasses(classes.data); // Αποθήκευση των classes
      setStudents(students.data); // Αποθήκευση των μαθητών
    } catch (error) {
      console.error('Error fetching stats: ', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/goals');
      const { studentGoal, revenueGoal, hoursGoal } = response.data;
      setStudentGoal(studentGoal);
      setRevenueGoal(revenueGoal);
      setHoursGoal(hoursGoal);
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };

  const calculateTotalHours = () => {
    return classes.reduce((acc, classData) => {
      const start = new Date(classData.start);
      const end = new Date(classData.end);
      const duration = (end - start) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);
  };

  const calculateTotalDebt = () => {
    return students.reduce((acc, student) => acc + student.debt, 0);
  };

  const calculateTotalRevenue = () => {
    return students.reduce((acc, student) => acc + student.paid, 0);
  };

  const handleDateChange = (date) => {
    if (viewMode === 'year') {
      setSelectedYear(date);
      setSelectedMonth(null);
      setSelectedWeek(null);
    } else if (viewMode === 'month') {
      setSelectedMonth(date);
      setSelectedWeek(null);
    } else if (viewMode === 'week') {
      setSelectedWeek(date);
    }
  };

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value); 
  };

  const openDateModal = () => {
    setModalIsOpen(true);
  };

  const closeDateModal = () => {
    setModalIsOpen(false);
    setDisplayStats(false);
  };

  const handleShowStats = () => {
    if (!selectedYear && viewMode === 'year') {
      setError('Παρακαλώ επιλέξτε έτος.');
      return;
    }
  
    if (selectedYear && !selectedMonth && !selectedWeek) {
      console.log('Προβολή στατιστικών για το έτος:', selectedYear.format('YYYY'));
    } else if (selectedYear && selectedMonth && !selectedWeek) {
      console.log('Προβολή στατιστικών για το μήνα:', selectedMonth.format('YYYY-MM'));
    } else if (selectedYear && selectedMonth && selectedWeek) {
      console.log('Προβολή στατιστικών για την εβδομάδα:', selectedWeek.map((date) => date.format('YYYY-MM-DD')));
    }
  
    setDisplayStats(true); 
    setModalIsOpen(false); 
  };

  const pieDataStudents = {
    labels: ['Σύνολο Μαθητών', 'Στόχος'],
    datasets: [
      {
        data: [students.length, studentGoal - students.length],
        backgroundColor: ['#FF6384', '#E0E0E0'],
        hoverBackgroundColor: ['#FF6384', '#E0E0E0']
      }
    ]
  };

  const pieDataRevenue = {
    labels: ['Σύνολο Εσόδων', 'Στόχος'],
    datasets: [
      {
        data: [calculateTotalRevenue(), revenueGoal - calculateTotalRevenue()],
        backgroundColor: ['#36A2EB', '#E0E0E0'],
        hoverBackgroundColor: ['#36A2EB', '#E0E0E0']
      }
    ]
  };

  const pieDataHours = {
    labels: ['Συνολικές Ώρες', 'Στόχος'],
    datasets: [
      {
        data: [calculateTotalHours(), hoursGoal - calculateTotalHours()],
        backgroundColor: ['#FFCE56', '#E0E0E0'],
        hoverBackgroundColor: ['#FFCE56', '#E0E0E0']
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Αρχική</h2>
        <div className="dashboard-controls">
          <Button variant="contained" onClick={openDateModal}>Επιλογή Ημερομηνίας</Button>
        </div>
      </div>
      <p>Γεια σου. Καλώς ήρθες στο ElProfessor!</p>
      <div className="cards">
        <div className="card">
          <h3>Σύνολο Μαθημάτων</h3>
          <p>{classes.length}</p>
        </div>
        <div className="card">
          <h3>Σύνολο Ωρών</h3>
          <p>{calculateTotalHours().toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Σύνολο Μαθητών</h3>
          <p>{students.length}</p>
        </div>
        <div className="card">
          <h3>Χρέη</h3>
          <p>{calculateTotalDebt().toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3>Έσοδα</h3>
          <p>{calculateTotalRevenue().toFixed(2)} €</p>
        </div>
      </div>
      <div className="charts">
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h3>Στόχος Μαθητών</h3>
            <Doughnut data={pieDataStudents} />
          </div>
          <div className="pie-chart">
            <h3>Στόχος Εσόδων</h3>
            <Doughnut data={pieDataRevenue} />
          </div>
          <div className="pie-chart">
            <h3>Στόχος Ωρών</h3>
            <Doughnut data={pieDataHours} />
          </div>
        </div>
      </div>

      {/* Modal για την επιλογή ημερομηνίας */}
      <Modal isOpen={modalIsOpen} onClose={closeDateModal}>
        <h2>Επιλογή Ημερομηνίας</h2>
        <div className="form-group">
          <label>Επιλέξτε mode προβολής:</label>
          <select value={viewMode} onChange={handleViewModeChange}>
            <option value="year">Έτος</option>
            <option value="month">Μήνας</option>
            <option value="week">Εβδομάδα</option>
          </select>

          <DashboardCalendar handleDateChange={handleDateChange} viewMode={viewMode} />
        </div>
        {error && <p className="error">{error}</p>}
        <Button onClick={handleShowStats}>Δες Στατιστικά</Button>
      </Modal>
    </div>
  );
});

export default Dashboard;
