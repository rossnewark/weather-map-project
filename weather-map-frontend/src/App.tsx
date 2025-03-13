import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './components/map';
import { WeatherData, PointOfInterest } from './types/interfaces';
import { fetchWeatherData } from './services/weatherService';
import { fetchPointsOfInterest } from './services/poiService';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch weather data
        const weather = await fetchWeatherData();
        setWeatherData(weather);
        
        // Fetch POI data when endpoint is available
        try {
          const pois = await fetchPointsOfInterest();
          setPointsOfInterest(pois);
        } catch (poiError) {
          console.warn('POI data not available yet:', poiError);
          // Set to empty array until backend endpoint is implemented
          setPointsOfInterest([]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>UK Weather & Points of Interest Map</h1>
      </header>
      
      {isLoading && <div className="loading">Loading map data...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      <Map 
        weatherData={weatherData}
        pointsOfInterest={pointsOfInterest}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;