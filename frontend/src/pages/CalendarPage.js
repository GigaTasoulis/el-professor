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
import deleteIcon from '../images/deletebutton.png';

const localizer = momentLocalizer(moment);

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

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes: ", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/professors');
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
      await axios.put(`http://localhost:5000/api/students/${existingStudent._id}/debt`, { debt: updatedDebt });
  
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
        const response = await axios.put(`http://localhost:5000/api/classes/${selectedEvent._id}`, eventData);
        console.log('Event updated:', response.data);
      } else {
        console.log('Creating event with data:', eventData);
        const response = await axios.post('http://localhost:5000/api/classes', eventData);
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
        <h2>{selectedEvent ? 'Επεξεργασία' : 'Προσθήκη Μαθήματος'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-section">
            <div className="modal-row">
              <FormGroup label="Ημ/νία">
                <DatePicker
                  selected={newEvent.start}
                  onChange={(date) => handleDateChange(date, 'start')}
                  dateFormat="dd-MMM-yyyy"
                  className="form-control"
                  disabled={!isEditing}
                />
              </FormGroup>
              <FormGroup label="Καθηγητής">
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
            </div>

            <div className="modal-row">
              <FormGroup label="Ώρα Έναρξης">
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
              <FormGroup label="Ώρα Λήξης">
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
            </div>

            <div className="modal-row">
              <FormGroup label="Αίθουσα">
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
              <FormGroup label="Μάθημα">
                <input
                  type="text"
                  name="lesson"
                  value={newEvent.lesson}
                  onChange={handleEventChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </FormGroup>
            </div>
          </div>

          <div className="modal-section">
              {newEvent.students.map((student, index) => {
                if (index % 2 === 0) {
                  const studentPair = newEvent.students.slice(index, index + 2);
                  return (
                    <div className="student-row" key={index}>
                      {studentPair.map((student, subIndex) => (
                        <FormGroup
                          label={`Μαθητής ${index + subIndex + 1}`}
                          key={index + subIndex}
                          className="student-form-group"
                        >
                          <div className="student-input-container">
                            <input
                              type="text"
                              value={student.name}
                              onChange={(e) => handleStudentChange(index + subIndex, e)}
                              className="form-control student-input"
                              list={`students-list-${index + subIndex}`}
                              disabled={!isEditing}
                            />
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeStudent(index + subIndex)}
                                className="delete-button"
                              >
                                <img src={deleteIcon} alt="Delete" className="delete-icon" />
                              </button>
                            )}
                          </div>
                          <datalist id={`students-list-${index + subIndex}`}>
                            {filterStudents(student.name).map((filteredStudent, i) => (
                              <option key={i} value={filteredStudent.name} />
                            ))}
                          </datalist>
                        </FormGroup>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>

          {isEditing ? (
            <div className="button-group">
                <button type="button" className="add-new-student" onClick={addStudent}>Προσθήκη Μαθητή</button>              
                <div className="row">
                <button type="submit" className="calendar-submit">Υποβολή</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Ακύρωση</button>
                </div>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>Επεξεργασία</button>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
