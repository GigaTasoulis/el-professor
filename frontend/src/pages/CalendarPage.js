import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/CalendarPage.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    className: '',
    lesson: '',
    teacher: user ? user.name : '',
    students: [{ name: '' }]
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log('Modal open:', modalOpen);
  }, [modalOpen]);

  useEffect(() => {
    console.log('New event state:', newEvent);
  }, [newEvent]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    console.log('Slot selected:', start, end);
    setNewEvent({ ...newEvent, start, end });
    setModalOpen(true);
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    console.log('Event change:', name, value);
  };

  const handleDateChange = (date, field) => {
    setNewEvent({ ...newEvent, [field]: date });
    console.log('Date change:', field, date);
  };

  const handleStudentChange = (index, e) => {
    const updatedStudents = newEvent.students.map((student, i) =>
      i === index ? { ...student, name: e.target.value } : student
    );
    setNewEvent({ ...newEvent, students: updatedStudents });
    console.log('Student change:', index, e.target.value);
  };

  const addStudent = () => {
    setNewEvent({ ...newEvent, students: [...newEvent.students, { name: '' }] });
    console.log('Added student');
  };

  const removeStudent = (index) => {
    const updatedStudents = newEvent.students.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, students: updatedStudents });
    console.log('Removed student:', index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting event:', newEvent);
    try {
      await axios.post('http://localhost:5000/api/classes', newEvent);
      setModalOpen(false);
      fetchEvents();
      console.log('Event created:', newEvent);
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {modalOpen && (
        <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2>Add Lesson</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleEventChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <DatePicker
                  selected={newEvent.start}
                  onChange={(date) => handleDateChange(date, 'start')}
                  dateFormat="dd-MMM-yyyy"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <DatePicker
                  selected={newEvent.start}
                  onChange={(date) => handleDateChange(date, 'start')}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <DatePicker
                  selected={newEvent.end}
                  onChange={(date) => handleDateChange(date, 'end')}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Class</label>
                <input
                  type="text"
                  name="className"
                  value={newEvent.className}
                  onChange={handleEventChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Lesson</label>
                <input
                  type="text"
                  name="lesson"
                  value={newEvent.lesson}
                  onChange={handleEventChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Teacher</label>
                <input
                  type="text"
                  name="teacher"
                  value={newEvent.teacher}
                  onChange={handleEventChange}
                  className="form-control"
                />
              </div>
              {newEvent.students.map((student, index) => (
                <div className="form-group" key={index}>
                  <label>Student {index + 1}</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => handleStudentChange(index, e)}
                    className="form-control"
                  />
                  <button type="button" onClick={() => removeStudent(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addStudent}>Add student</button>
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
