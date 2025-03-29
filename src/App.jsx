import { useState, useEffect } from "react";
import "./App.css";

import searchicon from "./assets/searchicon.png";
import clear from "./assets/clear.png";
import cloudy from "./assets/cloudy.png";
import drizzle from "./assets/drizzle.webp";
import humidityicon from "./assets/humidityicon.png";
import rain from "./assets/rain.png";
import snowflake from "./assets/snowflake.png";
import sun from "./assets/sun.png";
import windicon from "./assets/windicon.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  long,
  humidity,
  wind,
  sunrise,
  sunset,
  localTime,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="time">Local Time: {localTime}</div>
      <div className="sun">
        <div> Sunrise: {sunrise}</div>
        <div> Sunset: {sunset}</div>
      </div>
      <div className="cord">
        <div>
          <span className="lat">Latitude </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">Longitude </span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityicon} alt="humidity" className="icon" />
          <div className="humidity-percentage">{humidity}%</div>
          <div className="humidity-text">Humidity</div>
        </div>
        <div className="element">
          <img src={windicon} alt="wind" className="icon" />
          <div className="wind-percentage">{wind} km/h</div>
          <div className="wind-text">Wind speed</div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [text, setText] = useState("palakkad");
  const [icon, setIcon] = useState(clear);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("palakkad");
  const [country, setCountry] = useState("INDIA");
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const iconPicker = (weather, temp) => {
    weather = weather.toLowerCase();
    if (temp > 35) return sun;
    if (temp > 25 && weather.includes("clear")) return clear;
    if (temp > 20 && weather.includes("cloud")) return cloudy;
    if (temp > 10 && weather.includes("rain")) return rain;
    if (temp > 5 && weather.includes("drizzle")) return drizzle;
    if (temp <= 5) return snowflake;
    return sun;
  };

  const formatTime = (timestamp, timezone) => {
    return new Date((timestamp + timezone) * 1000)
      .toUTCString()
      .match(/\d{2}:\d{2}/)[0];
  };

  const updateLocalTime = (timezone) => {
    const localDate = new Date(Date.now() + timezone * 1000);
    setLocalTime(localDate.toUTCString().slice(17, 22));
  };

  const search = async () => {
    setLoading(true);
    setCityNotFound(false);
    const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=metric`;

    try {
      const weatherRes = await fetch(weatherURL);

      if (!weatherRes.ok) {
        setCityNotFound(true);
        return;
      }

      const weatherData = await weatherRes.json();
      const tempValue = weatherData.main.temp;
      const weatherMain = weatherData.weather[0].main;
      const timezone = weatherData.timezone;

      setTemp(Math.round(tempValue));
      setCity(weatherData.name);
      setCountry(weatherData.sys.country);
      setLat(weatherData.coord.lat);
      setLong(weatherData.coord.lon);
      setHumidity(weatherData.main.humidity);
      setWind(weatherData.wind.speed);
      setIcon(iconPicker(weatherMain, tempValue));

      setSunrise(formatTime(weatherData.sys.sunrise, timezone));
      setSunset(formatTime(weatherData.sys.sunset, timezone));
      updateLocalTime(timezone);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setCityNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container">
      <h1>Weather Details</h1>
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon" onClick={search}>
          <img src={searchicon} className="searchIcon" alt="Search" />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : cityNotFound ? (
        <div className="error">City not found. Please try again.</div>
      ) : (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          wind={wind}
          sunrise={sunrise}
          sunset={sunset}
          localTime={localTime}
        />
      )}
    </div>
  );
}

export default App;
