import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import FormGroup from '../components/FormGroup';
import '../styles/CalendarPage.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    start: new Date(),
    end: moment().add(1, 'hour').toDate(),
    className: '',
    lesson: '',
    teacher: user ? user.name : '',
    students: [{ name: '' }]
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchStudents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setNewEvent({ ...newEvent, start, end: moment(start).add(1, 'hour').toDate() });
    setModalOpen(true);
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setNewEvent({ ...newEvent, [field]: date });
  };

  const handleStudentChange = (index, e) => {
    const updatedStudents = newEvent.students.map((student, i) =>
      i === index ? { ...student, name: e.target.value } : student
    );
    setNewEvent({ ...newEvent, students: updatedStudents });
  };

  const filterStudents = (input) => {
    if (!input) return students;
    return students.filter(student => student.name.toLowerCase().includes(input.toLowerCase()));
  };

  const addStudent = () => {
    setNewEvent({ ...newEvent, students: [...newEvent.students, { name: '' }] });
  };

  const removeStudent = (index) => {
    const updatedStudents = newEvent.students.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, students: updatedStudents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/classes', newEvent);
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  const EventComponent = ({ event }) => (
    <span>
      <strong>{event.lesson}</strong>
      <div>{event.class}</div>
    </span>
  );

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
          views={['month', 'week', 'day']}
          components={{
            event: EventComponent
          }}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Add Lesson</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Date">
            <DatePicker
              selected={newEvent.start}
              onChange={(date) => handleDateChange(date, 'start')}
              dateFormat="dd-MMM-yyyy"
              className="form-control"
            />
          </FormGroup>
          <FormGroup label="Start Time">
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
          </FormGroup>
          <FormGroup label="End Time">
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
          </FormGroup>
          <FormGroup label="Class">
            <input
              type="text"
              name="className"
              value={newEvent.className}
              onChange={handleEventChange}
              className="form-control"
            />
          </FormGroup>
          <FormGroup label="Lesson">
            <input
              type="text"
              name="lesson"
              value={newEvent.lesson}
              onChange={handleEventChange}
              className="form-control"
            />
          </FormGroup>
          <FormGroup label="Teacher">
            <input
              type="text"
              name="teacher"
              value={newEvent.teacher}
              onChange={handleEventChange}
              className="form-control"
            />
          </FormGroup>
          {newEvent.students.map((student, index) => (
            <FormGroup label={`Student ${index + 1}`} key={index}>
              <input
                type="text"
                value={student.name}
                onChange={(e) => handleStudentChange(index, e)}
                className="form-control"
                list={`students-list-${index}`}
              />
              <datalist id={`students-list-${index}`}>
                {filterStudents(student.name).map((filteredStudent, i) => (
                  <option key={i} value={filteredStudent.name} />
                ))}
              </datalist>
              <button type="button" onClick={() => removeStudent(index)}>Remove</button>
            </FormGroup>
          ))}
          <div className="button-group">
            <button type="button" onClick={addStudent}>Add student</button>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
