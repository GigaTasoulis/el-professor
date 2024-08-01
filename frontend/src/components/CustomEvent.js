import React from 'react';

const CustomEvent = ({ event }) => {
  return (
    <span>
      <strong>{event.lesson}</strong>
      <p style={{ margin: 0 }}>{event.className}</p>
    </span>
  );
};

export default CustomEvent;
