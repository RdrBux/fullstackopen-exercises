import React from 'react';

const Notification = ({ notification }) => {
  const styles = {
    color: notification.isError ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    border: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    display: notification.message ? 'block' : 'none',
  };

  return (
    <div className="notification" style={styles}>
      {notification.message}
    </div>
  );
};

export default Notification;
