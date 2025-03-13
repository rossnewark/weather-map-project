import React from 'react';
import { useMap } from 'react-leaflet';
import { getUserLocationCoordinates } from '../services/locationService';

interface LocationButtonProps {
  setCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const LocationButton: React.FC<LocationButtonProps> = ({ setCenter }) => {
  const map = useMap();

  const handleLocationClick = async () => {
    try {
      const [lat, lng] = await getUserLocationCoordinates();
      map.flyTo([lat, lng], 13);
      setCenter([lat, lng]);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Could not access your location. Please check your browser permissions.');
    }
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          title="My Location"
          onClick={(e) => {
            e.preventDefault();
            handleLocationClick();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0078FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="8"></circle>
            <line x1="12" y1="2" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="22" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LocationButton;