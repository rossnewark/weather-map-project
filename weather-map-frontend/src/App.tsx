import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/map';
import { WeatherData, PointOfInterest } from './types/interfaces';
import { getWeatherData } from './services/weatherService';
import { getPointsOfInterest } from './services/poiService';

// This component gets weather and points of interest data and renders the map
function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get weather and POI data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get weather data
        const weather = await getWeatherData();
        setWeatherData(weather);
        
        // Get POI data when endpoint is available
        try {
          const pois = await getPointsOfInterest();
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

  // Render the app
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