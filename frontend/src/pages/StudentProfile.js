import React from 'react';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Student Profile</h1>
      <p>Profile details for student with ID: {id}</p>
    </div>
  );
};

export default StudentProfile;
