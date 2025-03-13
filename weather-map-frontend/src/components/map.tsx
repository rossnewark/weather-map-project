import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import WeatherMarker from './weatherMarker';
import POIMarker from './poiMarker';
import LocationButton from './locationButton';
import { WeatherData, PointOfInterest } from '../types/interfaces';
import { getUserLocationCoordinates } from '../services/locationService';

// Fix for default marker icons in Leaflet with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  weatherData: WeatherData[];
  pointsOfInterest: PointOfInterest[];
  isLoading: boolean;
}

const Map: React.FC<MapProps> = ({ weatherData, pointsOfInterest, isLoading }) => {
  const [center, setCenter] = useState<[number, number]>([51.5074, -0.1278]); // Default to London

  useEffect(() => {
    // Try to get user location when component mounts
    const getUserLocation = async () => {
      try {
        const coords = await getUserLocationCoordinates();
        setCenter(coords);
      } catch (error) {
        console.error('Could not get user location:', error);
        // Keep default center
      }
    };

    getUserLocation();
  }, []);

  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={7} 
        style={{ height: '600px', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <LocationButton setCenter={setCenter} />
        
        {!isLoading && weatherData.map((location) => (
          <WeatherMarker key={location.id} weatherData={location} />
        ))}
        
        {!isLoading && pointsOfInterest.map((poi) => (
          <POIMarker key={poi.id} poi={poi} />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;