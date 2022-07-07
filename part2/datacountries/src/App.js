import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [countrySelected, setCountrySelected] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => setCountries(response.data));
  }, []);

  const countriesFilter = [];

  countries.forEach((country) => {
    const name = country.name.common;
    if (name.toLowerCase().includes(filter.toLowerCase())) {
      countriesFilter.push(name);
    }
  });

  const displayCountries = () => {
    if (countrySelected) {
      return showCountry(countrySelected);
    }
    if (countriesFilter.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }
    if (countriesFilter.length > 1) {
      return countriesFilter.map((country) => {
        return (
          <div key={country}>
            {country + ' '}
            <button
              onClick={() => {
                setCountrySelected(country);
              }}
            >
              show
            </button>
          </div>
        );
      });
    }
    if (countriesFilter.length === 1) {
      return showCountry(countriesFilter[0]);
    }
    return <div>Not found</div>;
  };

  const showCountry = (name) => {
    const filterCountry = countries.filter(
      (country) => country.name.common === name
    );
    const country = filterCountry[0];
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
  };

  const handleChange = (e) => {
    setFilter(e.target.value);
    setCountrySelected('');
  };

  return (
    <div className="App">
      <div>
        find countries
        <input type="text" value={filter} onChange={handleChange} />
      </div>
      <div>{displayCountries()}</div>
    </div>
  );
}

export default App;
