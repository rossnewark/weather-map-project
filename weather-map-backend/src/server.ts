import dotenv from "dotenv";
import path from "path";
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for the React frontend
app.use(cors());
app.use(express.json());

// Get the OpenWeatherMap API Key from the .env file
const API_KEY = process.env.OPENWEATHER_API_KEY;
console.log("API_KEY:", API_KEY);

// Major cities to fetch weather data for
const CITIES = [
  { name: 'New York', country: 'US' },
  { name: 'Los Angeles', country: 'US' },
  { name: 'Chicago', country: 'US' },
  { name: 'Miami', country: 'US' },
  { name: 'Seattle', country: 'US' },
  { name: 'Denver', country: 'US' },
  { name: 'London', country: 'GB' },
  { name: 'Paris', country: 'FR' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Sydney', country: 'AU' },
  { name: 'Cairo', country: 'EG' },
  { name: 'Rio de Janeiro', country: 'BR' },
];

// Endpoint to fetch weather data
app.get('/api/weather', async (req, res) => {
  try {
    // Fetch weather data for multiple cities
    const weatherPromises = CITIES.map(async (city) => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${API_KEY}`
      );
      return response.data;
    });

    // Wait for all API calls to complete
    const weatherData = await Promise.all(weatherPromises);

    // Format the response
    const formattedData = weatherData.map(city => ({
      id: city.id,
      name: city.name,
      lat: city.coord.lat,
      lon: city.coord.lon,
      weather: {
        main: city.weather[0].main,
        description: city.weather[0].description,
        icon: city.weather[0].icon
      },
      main: {
        temp: city.main.temp,
        feels_like: city.main.feels_like,
        humidity: city.main.humidity
      },
      wind: {
        speed: city.wind.speed
      }
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});