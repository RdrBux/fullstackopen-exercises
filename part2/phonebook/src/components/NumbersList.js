import React from 'react';

const NumbersList = ({ persons, filter }) => {
  return persons.map((person) => {
    if (person.name.toLowerCase().includes(filter.toLowerCase())) {
      return (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      );
    } else return undefined;
  });
};

export default NumbersList;
