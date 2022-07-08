import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import NewPerson from './components/NewPerson';
import NumbersList from './components/NumbersList';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => setPersons(response.data));
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

    axios.post('http://localhost:3001/persons', newPerson);

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
