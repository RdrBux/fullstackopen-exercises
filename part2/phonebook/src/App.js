import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import NewPerson from './components/NewPerson';
import NumbersList from './components/NumbersList';
import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personsService.getAll().then((list) => setPersons(list));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      return alert(`${newName} is already added to phonebook`);
    }

    const newPerson = {
      name: newName,
      number: newPhone,
    };

    personsService
      .create(newPerson)
      .then((data) => setPersons(persons.concat(data)));

    setNewName('');
    setNewPhone('');
  };

  const handleFilter = (e) => setFilter(e.target.value);

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personsService.remove(id);
      setPersons(persons.filter((person) => person.id !== id));
    }
  };

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
      <NumbersList
        persons={persons}
        filter={filter}
        removePerson={removePerson}
      />
    </div>
  );
};

export default App;
