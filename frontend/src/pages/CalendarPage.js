import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { getClasses, createClass } from '../services/classService';
import '../styles/CalendarPage.css'; // Make sure to create this CSS file

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState('');
  const [professor, setProfessor] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const classes = await getClasses();
    const events = classes.map(cls => ({
      id: cls._id,
      title: cls.subject,
      start: new Date(cls.date),
      end: new Date(new Date(cls.date).getTime() + 60 * 60 * 1000), // Assuming each class is 1 hour
      students: cls.students,
      professor: cls.professor,
    }));
    setEvents(events);
  };

  const handleSelect = ({ start }) => {
    setSelectedDate(start);
    setModalIsOpen(true);
  };

  const handleCreateClass = async () => {
    const classData = {
      subject,
      date: selectedDate,
      students: students.split(',').map(s => s.trim()),
      professor,
    };
    await createClass(classData);
    setModalIsOpen(false);
    setSubject('');
    setStudents('');
    setProfessor('');
    loadClasses();
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelect}
        views={['month', 'week', 'day']}
        defaultView="week"
      />
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} ariaHideApp={false}>
        <h2>Create Class</h2>
        <form>
          <div>
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label>Students (comma separated)</label>
            <input
              type="text"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
            />
          </div>
          <div>
            <label>Professor</label>
            <input
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleCreateClass}>
            Create Class
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
