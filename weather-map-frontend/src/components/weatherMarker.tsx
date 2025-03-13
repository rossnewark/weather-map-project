import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { WeatherData } from '../types/interfaces';
import { getWeatherIconUrl } from '../services/weatherService';

interface WeatherMarkerProps {
  weatherData: WeatherData;
}

const WeatherMarker: React.FC<WeatherMarkerProps> = ({ weatherData }) => {
  // Get appropriate icon based on weather condition
  const getWeatherIcon = (condition: string) => {
    const iconColor = 
      condition.includes('rain') ? 'blue' :
      condition.includes('cloud') ? 'gray' :
      condition.includes('clear') ? 'yellow' :
      condition.includes('snow') ? 'white' : 'green';
    
    return L.divIcon({
      className: 'custom-icon weather-icon',
      html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <Marker 
      key={weatherData.id} 
      position={[weatherData.lat, weatherData.lon]}
      icon={getWeatherIcon(weatherData.weather.main.toLowerCase())}
    >
      <Popup>
        <div className="popup-content">
          <h3>{weatherData.name}</h3>
          <div className="weather-info">
            <p><strong>Weather:</strong> {weatherData.weather.description}</p>
            <p><strong>Temperature:</strong> {Math.round(weatherData.main.temp)}°C</p>
            <p><strong>Feels like:</strong> {Math.round(weatherData.main.feels_like)}°C</p>
            <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
            <p><strong>Wind:</strong> {weatherData.wind.speed} m/s</p>
          </div>
          <img 
            src={getWeatherIconUrl(weatherData.weather.icon)} 
            alt={weatherData.weather.description}
          />
        </div>
      </Popup>
    </Marker>
  );
};

export default WeatherMarker;