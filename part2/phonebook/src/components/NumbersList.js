import React from 'react';

const NumbersList = ({ persons, filter, removePerson }) => {
  return persons.map((person) => {
    if (person.name.toLowerCase().includes(filter.toLowerCase())) {
      return (
        <p key={person.name}>
          {person.name} {person.number}{' '}
          <button onClick={() => removePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      );
    } else return undefined;
  });
};

export default NumbersList;
