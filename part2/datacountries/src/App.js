import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => setCountries(response.data));
  }, []);

  const countriesFilter = [];

  countries.forEach((country) => {
    const name = country.name.common;
    if (name.toLowerCase().includes(filter.toLowerCase())) {
      countriesFilter.push(country);
    }
  });

  const displayCountries = () => {
    if (countriesFilter.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }
    if (countriesFilter.length > 1) {
      return countriesFilter.map((country) => {
        const name = country.name.common;
        return <div key={name}>{name}</div>;
      });
    }
    if (countriesFilter.length === 1) {
      const country = countriesFilter[0];
      return (
        <div>
          <h1>{country.name.common}</h1>

          <div>capital {country.capital[0]}</div>
          <div>area {country.area}</div>

          <h3>languages:</h3>
          <ul>
            {Object.values(country.languages).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>

          <img src={country.flags.png} alt={`${country.name.common} flag`} />
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div>
        find countries
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div>{displayCountries()}</div>
    </div>
  );
}

export default App;
