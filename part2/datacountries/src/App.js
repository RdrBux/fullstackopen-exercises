import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [countrySelected, setCountrySelected] = useState('');
  const [countryWeather, setCountryWeather] = useState('');

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY;
    if (countrySelected) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${countrySelected.capital}&units=metric&APPID=${api_key}`
        )
        .then((response) => response.data)
        .then((data) => setCountryWeather(data));
    } else setCountryWeather('');
  }, [countrySelected]);

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
    if (countrySelected) {
      return showCountry(countrySelected);
    }

    if (countriesFilter.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }
    if (countriesFilter.length > 1) {
      return countriesFilter.map((country) => {
        const name = country.name.common;
        return (
          <div key={name}>
            {name + ' '}
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
      return setCountrySelected(countriesFilter[0]);
    }
    return <div>Not found</div>;
  };

  const showCountry = (country) => {
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

        {countryWeather && (
          <div>
            <h2>Weather in {country.capital[0]}</h2>
            <div>temperature {countryWeather.main.temp} Celcius</div>
            <img
              src={`http://openweathermap.org/img/wn/${countryWeather.weather[0].icon}@2x.png`}
              alt={countryWeather.weather[0].description}
            />
            <div>wind {countryWeather.wind.speed} m/s</div>
          </div>
        )}
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
        find countries{' '}
        <input type="text" value={filter} onChange={handleChange} />
      </div>
      <div>{displayCountries()}</div>
    </div>
  );
}

export default App;
