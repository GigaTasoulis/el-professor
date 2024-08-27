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

// Use the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    start: new Date(),
    end: moment().add(1, 'hour').toDate(),
    className: '',
    lesson: '',
    teacher: user ? user.name : '',
    students: [{ name: '' }],
    costPerClass: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchStudents();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}classes`);
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
      const response = await axios.get(`${API_BASE_URL}students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}classes`);
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes: ", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}professors`);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers: ", error);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setNewEvent({ ...newEvent, start, end: moment(start).add(1, 'hour').toDate() });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      start: new Date(event.start),
      end: new Date(event.end),
      className: event.class,
      lesson: event.lesson,
      teacher: event.teacher,
      students: event.students
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setNewEvent((prevState) => ({
      ...prevState,
      [field]: date
    }));
  };

  const handleStudentChange = (index, e) => {
    const updatedStudents = newEvent.students.map((student, i) =>
      i === index ? { ...student, name: e.target.value } : student
    );
    setNewEvent((prevState) => ({
      ...prevState,
      students: updatedStudents
    }));
  };

  const filterStudents = (input) => {
    if (!input) return students;
    return students.filter(student => student.name.toLowerCase().includes(input.toLowerCase()));
  };

  const addStudent = () => {
    setNewEvent((prevState) => ({
      ...prevState,
      students: [...prevState.students, { name: '' }]
    }));
  };

  const removeStudent = (index) => {
    const updatedStudents = newEvent.students.filter((_, i) => i !== index);
    setNewEvent((prevState) => ({
      ...prevState,
      students: updatedStudents
    }));
  };

  const calculateDebtPerStudent = (numberOfStudents, durationInHours) => {
    let costPerStudent;
  
    if (numberOfStudents === 1) {
      costPerStudent = 25;
    } else if (numberOfStudents === 2) {
      costPerStudent = 15;
    } else if (numberOfStudents === 3) {
      costPerStudent = 12.5;
    } else if (numberOfStudents >= 4 && numberOfStudents <= 5) {
      costPerStudent = 10;
    } else {
      costPerStudent = 0; // Default in case there are more than 5 students (adjust if necessary)
    }
  
    return costPerStudent * durationInHours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const numberOfStudents = newEvent.students.length;
  
    if (numberOfStudents === 0) {
      console.error("You must add at least one student.");
      return;
    }
  
    // Calculate the duration of the class in hours
    const durationInHours = (newEvent.end - newEvent.start) / (1000 * 60 * 60);
  
    // Calculate debt per student based on the number of students and duration
    const debtPerStudent = calculateDebtPerStudent(numberOfStudents, durationInHours);
  
    // Fetch existing debt for each student and update their debt
    const updatedStudents = await Promise.all(newEvent.students.map(async (student) => {
      const existingStudent = students.find(s => s.name === student.name);
      const updatedDebt = existingStudent.debt + debtPerStudent;
  
      // Update the student's debt in the database via the new debt-specific endpoint
      await axios.put(`${API_BASE_URL}students/${existingStudent._id}/debt`, { debt: updatedDebt });
  
      return {
        ...student,
        debt: updatedDebt
      };
    }));
  
    const eventData = {
      start: newEvent.start,
      end: newEvent.end,
      class: newEvent.className,
      lesson: newEvent.lesson,
      teacher: newEvent.teacher,
      students: updatedStudents,
      costPerClass: debtPerStudent * numberOfStudents // Total cost is debt per student multiplied by the number of students
    };
  
    console.log('Event data:', eventData);
  
    try {
      if (selectedEvent) {
        console.log('Updating event:', selectedEvent._id);
        const response = await axios.put(`${API_BASE_URL}classes/${selectedEvent._id}`, eventData);
        console.log('Event updated:', response.data);
      } else {
        console.log('Creating event with data:', eventData);
        const response = await axios.post(`${API_BASE_URL}classes`, eventData);
        console.log('Event created:', response.data);
      }
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error creating/updating event: ", error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
      }
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
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day']}
          components={{
            event: EventComponent
          }}
        />
      </div>

      <button type="button" id="open-calendar-modal-btn" className="btn btn-primary" style={{ display: 'none' }} onClick={() => handleSelectSlot({ start: new Date() })}>
        +Add Event
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{selectedEvent ? 'View/Edit Lesson' : 'Add Lesson'}</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup label="Date">
            <DatePicker
              selected={newEvent.start}
              onChange={(date) => handleDateChange(date, 'start')}
              dateFormat="dd-MMM-yyyy"
              className="form-control"
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup label="Class">
            <input
              type="text"
              name="className"
              value={newEvent.className}
              onChange={handleEventChange}
              className="form-control"
              disabled={!isEditing}
              list="classes-list"
            />
            <datalist id="classes-list">
              {classes.map((classItem, index) => (
                <option key={index} value={classItem.name} />
              ))}
            </datalist>
          </FormGroup>
          <FormGroup label="Lesson">
            <input
              type="text"
              name="lesson"
              value={newEvent.lesson}
              onChange={handleEventChange}
              className="form-control"
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup label="Teacher">
            <input
              type="text"
              name="teacher"
              value={newEvent.teacher}
              onChange={handleEventChange}
              className="form-control"
              disabled={!isEditing}
              list="teachers-list"
            />
            <datalist id="teachers-list">
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.name} />
              ))}
            </datalist>
          </FormGroup>
          {newEvent.students.map((student, index) => (
            <FormGroup label={`Student ${index + 1}`} key={index}>
              <input
                type="text"
                value={student.name}
                onChange={(e) => handleStudentChange(index, e)}
                className="form-control"
                list={`students-list-${index}`}
                disabled={!isEditing}
              />
              <datalist id={`students-list-${index}`}>
                {filterStudents(student.name).map((filteredStudent, i) => (
                  <option key={i} value={filteredStudent.name} />
                ))}
              </datalist>
              {isEditing && <button type="button" onClick={() => removeStudent(index)}>Remove</button>}
            </FormGroup>
          ))}
          {isEditing && <button type="button" onClick={addStudent}>Add student</button>}
          {isEditing ? (
            <div className="button-group">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
