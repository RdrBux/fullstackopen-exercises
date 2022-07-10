import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import NewPerson from './components/NewPerson';
import NumbersList from './components/NumbersList';
import personsService from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personsService.getAll().then((list) => setPersons(list));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newPhone,
    };

    const alreadyExists = persons.find((person) => person.name === newName);

    if (alreadyExists) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personsService.update(alreadyExists.id, newPerson).then((data) => {
          setPersons((prevState) =>
            prevState.map((person) => (person.id === data.id ? data : person))
          );
          showNotification(data.name, true);
        });
      }
    } else {
      personsService.create(newPerson).then((data) => {
        setPersons(persons.concat(data));
        showNotification(newPerson.name);
      });
    }
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

  const showNotification = (name, existing = false) => {
    if (existing) {
      setNotification(`Changed ${name} number`);
    } else {
      setNotification(`Added ${name}`);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
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
