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
  const [lessons, setLessons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
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
    fetchLessons();
    fetchClassrooms();
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

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classrooms'); 
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms: ", error);
    }
  };
  

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lessons');
      setLessons(response.data);
    } catch (error) {
      console.error("Error fetching lessons: ", error);
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
    setNewEvent({
      start: start,
      end: moment(start).add(1, 'hour').toDate(),
      className: '',
      lesson: '',
      teacher: '', 
      students: [{ name: '' }],
      costPerClass: ''
    });
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

  const resetNewEvent = () => {
    setNewEvent({
      start: new Date(),
      end: moment().add(1, 'hour').toDate(),
      className: '',
      lesson: '',
      teacher: '', 
      students: [{ name: '' }],
      costPerClass: ''
    });
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
      costPerStudent = 0;
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
  
      if (!existingStudent) {
        console.error(`Student ${student.name} not found.`);
        return student;  // Skip if the student doesn't exist
      }
  
      const updatedDebt = existingStudent.debt + debtPerStudent;
  
      // Update student's debt
      await axios.put(`http://localhost:5000/api/students/${existingStudent._id}/debt`, { debt: updatedDebt });
  
      return {
        ...student,
        debt: updatedDebt,
        _id: existingStudent._id  // Return student ID to update class later
      };
    }));
  
    const eventData = {
      start: newEvent.start,
      end: newEvent.end,
      class: newEvent.className,
      lesson: newEvent.lesson,
      teacher: newEvent.teacher,
      students: updatedStudents,
      costPerClass: debtPerStudent * numberOfStudents 
    };
  
    console.log('Event data:', eventData);
  
    try {
      let classId;
  
      if (selectedEvent) {
        console.log('Updating event:', selectedEvent._id);
        const response = await axios.put(`http://localhost:5000/api/classes/${selectedEvent._id}`, eventData);
        classId = selectedEvent._id;
        console.log('Event updated:', response.data);
      } else {
        console.log('Creating event with data:', eventData);
        const response = await axios.post('http://localhost:5000/api/classes', eventData);
        classId = response.data._id;
        console.log('Event created:', response.data);
      }
  
      // Add the class to the students' history
      await Promise.all(updatedStudents.map(async (student) => {
        if (student._id) {  // Ensure we have a valid student ID
          await axios.put(`http://localhost:5000/api/students/${student._id}/add-class`, { classId });
        }
      }));
  
      setModalOpen(false);
      fetchEvents();
      resetNewEvent();  // Reset the form state after submission
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

      <Modal isOpen={modalOpen} onClose={() => {setModalOpen(false); resetNewEvent();}}>
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
                <select
                  name="teacher"
                  value={newEvent.teacher}
                  onChange={handleEventChange}
                  className="form-control teacher-select"
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Επιλέξτε Καθηγητή
                  </option>
                  {teachers.map((teacher, i) => (
                    <option key={i} value={teacher.name}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
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
                <select
                  name="className"
                  value={newEvent.className}
                  onChange={handleEventChange}
                  className="form-control classroom-select"
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Επιλέξτε Αίθουσα
                  </option>
                  {classrooms.map((classroom, i) => (
                    <option key={i} value={classroom.name}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Μάθημα">
                <select
                  name="lesson"
                  value={newEvent.lesson}
                  onChange={handleEventChange}
                  className="form-control lesson-select"
                  disabled={!isEditing}
                >
                  <option value="" disabled>
                    Επιλέξτε Μάθημα
                  </option>
                  {lessons.map((lesson, i) => (
                    <option key={i} value={lesson.name}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
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
                          <select
                            value={student.name}
                            onChange={(e) => handleStudentChange(index + subIndex, e)}
                            className="form-control student-select"
                            disabled={!isEditing}
                          >
                            <option value="" disabled>
                              Επιλέξτε Μαθητή
                            </option>
                            {students.map((availableStudent, i) => (
                              <option key={i} value={availableStudent.name}>
                                {availableStudent.name}
                              </option>
                            ))}
                          </select>
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
