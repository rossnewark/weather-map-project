import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix for default marker icons in Leaflet with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom weather icon based on weather condition
const getWeatherIcon = (condition: string) => {
  const iconColor = 
    condition.includes('rain') ? 'blue' :
    condition.includes('cloud') ? 'gray' :
    condition.includes('clear') ? 'yellow' :
    condition.includes('snow') ? 'white' : 'green';
  
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface WeatherData {
  id: number;
  name: string;
  lat: number;
  lon: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const center: [number, number] = [40.7128, -74.0060]; // Default center (New York)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Map</h1>
      </header>
      
      {isLoading && <div className="loading">Loading weather data...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      <div className="map-container">
        <MapContainer center={center} zoom={4} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {weatherData.map((location) => (
            <Marker 
              key={location.id} 
              position={[location.lat, location.lon]}
              icon={getWeatherIcon(location.weather.main.toLowerCase())}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{location.name}</h3>
                  <div className="weather-info">
                    <p><strong>Weather:</strong> {location.weather.description}</p>
                    <p><strong>Temperature:</strong> {Math.round(location.main.temp)}°C</p>
                    <p><strong>Feels like:</strong> {Math.round(location.main.feels_like)}°C</p>
                    <p><strong>Humidity:</strong> {location.main.humidity}%</p>
                    <p><strong>Wind:</strong> {location.wind.speed} m/s</p>
                  </div>
                  <img 
                    src={`http://openweathermap.org/img/wn/${location.weather.icon}@2x.png`} 
                    alt={location.weather.description}
                  />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
