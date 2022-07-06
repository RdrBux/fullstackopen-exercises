import React from 'react';
import Part from './Part';

const Content = ({ parts }) => {
  const total = parts.reduce((acc, cur) => acc + cur.exercises, 0);
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <p>
        <strong>total of {total} exercises</strong>
      </p>
    </>
  );
};

export default Content;
