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
  const getWeatherIcon = (condition: string, iconCode: string) => {
    // Define weather type configurations with FontAwesome icons and colors
    const weatherTypes: Record<string, { icon: string, color: string, bgColor: string }> = {
      // Rain conditions
      'rain': { icon: 'fa-cloud-rain', color: 'white', bgColor: '#0066CC' },
      'drizzle': { icon: 'fa-cloud-drizzle', color: 'white', bgColor: '#4D94FF' },
      'shower': { icon: 'fa-cloud-showers-heavy', color: 'white', bgColor: '#003366' },
      'thunderstorm': { icon: 'fa-bolt', color: 'white', bgColor: '#33007A' },
      
      // Clear conditions
      'clear': { icon: 'fa-sun', color: '#FFD700', bgColor: '#FF9900' },
      
      // Cloudy conditions
      'cloud': { icon: 'fa-cloud', color: 'white', bgColor: '#778899' },
      'overcast': { icon: 'fa-cloud', color: 'white', bgColor: '#555555' },
      'fog': { icon: 'fa-smog', color: 'white', bgColor: '#AAAAAA' },
      'mist': { icon: 'fa-smog', color: 'white', bgColor: '#AAAAAA' },
      'haze': { icon: 'fa-smog', color: 'white', bgColor: '#AAAAAA' },
      
      // Snow conditions
      'snow': { icon: 'fa-snowflake', color: 'white', bgColor: '#A5F2F3' },
      'sleet': { icon: 'fa-snowflake', color: 'white', bgColor: '#7FBCBD' },
      'hail': { icon: 'fa-icicles', color: 'white', bgColor: '#7FBCBD' },
      
      // Default
      'default': { icon: 'fa-cloud-sun', color: 'white', bgColor: '#4CA64C' }
    };
    
    // Check for time of day from icon code to show night versions where applicable
    const isNight = iconCode && iconCode.includes('n');
    
    // Convert condition to lowercase for matching
    const lowerCondition = condition.toLowerCase();
    
    // Find matching weather type
    let iconInfo = null;
    
    // Try to find direct match first
    for (const type in weatherTypes) {
      if (lowerCondition.includes(type)) {
        iconInfo = weatherTypes[type];
        break;
      }
    }
    
    // If no match found, use default
    if (!iconInfo) {
      iconInfo = weatherTypes.default;
    }
    
    // Adjust icon for nighttime if applicable
    if (isNight) {
      if (iconInfo.icon === 'fa-sun') {
        iconInfo.icon = 'fa-moon';
        iconInfo.bgColor = '#2C3E50';
      } else if (iconInfo.icon === 'fa-cloud-sun') {
        iconInfo.icon = 'fa-cloud-moon';
        iconInfo.bgColor = '#2C3E50';
      }
    }
    
    // Create temperature text (show rounded temp in °C)
    const temp = Math.round(weatherData.main.temp);
    
    // Get temperature color based on value
    const getTempColor = (temp: number) => {
      if (temp <= 0) return '#00FFFF'; // Cyan for freezing
      if (temp <= 10) return '#FFFFFF'; // White for cold
      if (temp <= 20) return '#FFFF00'; // Yellow for mild
      if (temp <= 30) return '#FFA500'; // Orange for warm
      return '#FF0000'; // Red for hot
    };
    
    // Create the div icon with FontAwesome and temperature
    return L.divIcon({
      className: 'custom-weather-icon',
      html: `
        <div style="
          background-color: ${iconInfo.bgColor}; 
          width: 40px; 
          height: 40px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center; 
          border-radius: 50%; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
          border: 2px solid white;
        ">
          <i class="fas ${iconInfo.icon}" style="color: ${iconInfo.color}; font-size: 18px;"></i>
          <span style="
            font-size: 10px; 
            font-weight: bold; 
            margin-top: 2px; 
            color: ${getTempColor(temp)};
          ">${temp}°</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  return (
    <Marker 
      key={weatherData.id} 
      position={[weatherData.lat, weatherData.lon]}
      icon={getWeatherIcon(
        weatherData.weather.description.toLowerCase(), 
        weatherData.weather.icon
      )}
    >
      <Popup>
        <div className="popup-content">
          <h3>{weatherData.name}</h3>
          <div className="weather-info">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img 
                src={getWeatherIconUrl(weatherData.weather.icon)} 
                alt={weatherData.weather.description}
                style={{ marginRight: '10px' }}
              />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {Math.round(weatherData.main.temp)}°C
              </span>
            </div>
            <p><strong>Weather:</strong> {weatherData.weather.description}</p>
            <p><strong>Feels like:</strong> {Math.round(weatherData.main.feels_like)}°C</p>
            <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
            <p><strong>Wind:</strong> {weatherData.wind.speed} m/s</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default WeatherMarker;