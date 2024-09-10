import { useState } from 'react';
import { DateTime } from 'luxon';
import './style.css';
import hazy from './assets/hazy.jpg';
import chirping from './assets/chirping-bird.jpg';
import rainy from './assets/raining-clouds.jpg';
import windy from './assets/windy.jpg';


const apiKey = 'd46fa3fc6d368cfac6b99d2edad216c2'; // Replace with your OpenWeatherMap API key

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#fff'); // Default background
  const [icon, setIcon] = useState(''); // State for weather icon

  const getWeather = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        setError('');
        updateBackgroundColor(data.weather[0].main); // Update background based on weather
        setIcon(getWeatherIcon(data.weather[0].main.toLowerCase())); // Set icon based on weather
      } else {
        setError('City not found!');
        setWeather(null);
        setBackgroundColor('#fff'); // Reset background for errors
        setIcon(''); // Reset icon for errors
      }
    } catch (err) {
      setError('Error fetching data!');
      console.error('Error fetching data:', err);
      setBackgroundColor('#fff'); // Reset background for errors
      setIcon(''); // Reset icon for errors
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      getWeather(city);
      setCity(''); // Clear input after submission
    }
  };

  const getLocalTime = (timezoneOffset) => {
    const utcTime = DateTime.utc();
    const localTime = utcTime.plus({ seconds: timezoneOffset });
    return localTime.toLocaleString(DateTime.TIME_SIMPLE); // Returns time in hh:mm:ss format
  };

  const updateBackgroundColor = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        setBackgroundColor('#87CEEB'); // Blue for sunny/clear weather
        break;
      case 'clouds':
        setBackgroundColor('#B0C4DE'); // Gray for cloudy weather
        break;
      case 'rain':
      case 'drizzle':
        setBackgroundColor('#778899'); // Dark gray for rainy weather
        break;
      case 'thunderstorm':
        setBackgroundColor('#483D8B'); // Darker color for thunderstorm
        break;
      case 'snow':
        setBackgroundColor('#FFFFFF'); // White for snow
        break;
      case 'windy':
        setBackgroundColor('#D0E5E8'); // Light gray for windy weather
        break;
      case 'haze':
        setBackgroundColor('#F0E4D7'); // Beige for hazy weather
        break;
      default:
        setBackgroundColor('#fff'); // Default background color
        break;
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'clear':
        return chirping; // Image for sunny weather
      case 'rain':
      case 'drizzle':
        return rainy; // Image for rainy weather
      case 'windy':
        return windy; // Image for windy weather
      case 'haze':
        return hazy; // Image for hazy weather
      default:
        return ''; // No icon for other conditions
    }
  };

  return (
    <div className="container" style={{ backgroundColor }}>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p><strong>Current Time:</strong> {getLocalTime(weather.timezone)}</p>
          {icon && <img src={icon} alt="Weather Icon" className="weather-icon" />}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
          <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
