import dotenv from "dotenv";
import path from "path";
import express, { Request, Response } from 'express';
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
// If you add additional APIs, add their keys here
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

// UK cities to fetch weather data for
const UK_CITIES = [
  { name: 'London', country: 'GB' },
  { name: 'Brighton', country: 'GB' },
  { name: 'Eastbourne', country: 'GB' },
  { name: 'Hailsham', country: 'GB' },
  { name: 'Manchester', country: 'GB' },
  { name: 'Edinburgh', country: 'GB' },
  { name: 'Cardiff', country: 'GB' },
  { name: 'Belfast', country: 'GB' },
  { name: 'Liverpool', country: 'GB' },
  { name: 'Birmingham', country: 'GB' },
  { name: 'Bristol', country: 'GB' },
  { name: 'Leeds', country: 'GB' },
];

// Keep some international cities too
const INTERNATIONAL_CITIES = [
  { name: 'New York', country: 'US' },
  { name: 'Paris', country: 'FR' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Sydney', country: 'AU' },
];

// Combine city lists
const ALL_CITIES = [...UK_CITIES, ...INTERNATIONAL_CITIES];

// Endpoint to fetch weather data
app.get('/api/weather', async (req: Request, res: Response): Promise<void> => {  
  try {
    // Fetch weather data for multiple cities
    const weatherPromises = ALL_CITIES.map(async (city) => {
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

// Endpoint to fetch points of interest
app.get('/api/pois', async (req: Request, res: Response): Promise<void> => {  
  try {
    // Default to central London if no coordinates provided
    const { lat = '51.5074', lng = '-0.1278' } = req.query as { lat?: string, lng?: string };
    
    const response = await axios.get(
      'https://api.foursquare.com/v3/places/search',
      {
        params: {
          ll: `${lat},${lng}`,
          radius: 10000, // 10km radius
          limit: 50,
          categories: '13000,13065,16000,17000', // Food, Nightlife, Attractions, Transport
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': FOURSQUARE_API_KEY
        }
      }
    );
    
    // Format the response to match our PointOfInterest interface
    const formattedData = response.data.results.map((poi: any) => ({
      id: poi.fsq_id,
      name: poi.name,
      lat: poi.geocodes.main.latitude,
      lon: poi.geocodes.main.longitude,
      category: poi.categories[0]?.name || 'Uncategorized',
      address: poi.location?.formatted_address
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching points of interest:', error);
    res.status(500).json({ message: 'Failed to fetch points of interest' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});