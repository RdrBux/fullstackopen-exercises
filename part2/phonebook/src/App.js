import { useState } from 'react';
import Filter from './components/Filter';
import NewPerson from './components/NewPerson';
import NumbersList from './components/NumbersList';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      return alert(`${newName} is already added to phonebook`);
    }

    const newPerson = {
      name: newName,
      number: newPhone,
    };
    setPersons(persons.concat(newPerson));
    setNewName('');
  };

  const handleFilter = (e) => setFilter(e.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter} />

      <h2>add a new</h2>
      <NewPerson
        name={newName}
        changeName={(e) => setNewName(e.target.value)}
        number={newPhone}
        changeNumber={(e) => setNewPhone(e.target.value)}
        handleSubmit={handleSubmit}
      />

      <h2>Numbers</h2>
      <NumbersList persons={persons} filter={filter} />
    </div>
  );
};

export default App;
