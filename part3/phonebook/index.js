const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');

const app = express();

app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

/* let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]; */

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => response.json(person));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((pers) => {
      console.log(pers);
      if (pers) {
        response.json(pers);
      } else {
        response.status(404).send({ error: 'unknown endpoint' });
      }
    })
    .catch((err) => next(err));
});

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then((docCount) =>
      response.send(`
    <p>Phonebook has info for ${docCount} people</p>
    <p>${new Date()}</p>  
    `)
    )
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err));
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'content missing' });
  }

  /* if (persons.some((pers) => pers.name === person.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  } */

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson.save().then((savedPerson) => response.json(savedPerson));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
