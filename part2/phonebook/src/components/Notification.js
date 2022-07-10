import React from 'react';

const Notification = ({ message }) => {
  const styles = {
    color: 'green',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    border: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    display: message ? 'block' : 'none',
  };

  return (
    <div className="notification" style={styles}>
      {message}
    </div>
  );
};

export default Notification;
