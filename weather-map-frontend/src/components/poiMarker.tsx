import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PointOfInterest } from '../types/interfaces';

interface POIMarkerProps {
  poi: PointOfInterest;
}

const POIMarker: React.FC<POIMarkerProps> = ({ poi }) => {
  // Get icon based on POI category
  const getPOIIcon = (category: string) => {
    // Define colors for different categories
    const categoryColors: Record<string, string> = {
      restaurant: '#FF5733',
      cafe: '#C70039',
      bar: '#900C3F',
      attraction: '#581845',
      hotel: '#FFC300',
      shop: '#DAF7A6',
      transport: '#3498DB',
      default: '#2E4053'
    };
    
    const color = categoryColors[category.toLowerCase()] || categoryColors.default;
    
    return L.divIcon({
      className: 'custom-icon poi-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <Marker 
      key={poi.id} 
      position={[poi.lat, poi.lon]}
      icon={getPOIIcon(poi.category)}
    >
      <Popup>
        <div className="popup-content">
          <h3>{poi.name}</h3>
          <div className="poi-info">
            <p><strong>Category:</strong> {poi.category}</p>
            {poi.description && <p><strong>Description:</strong> {poi.description}</p>}
            {poi.address && <p><strong>Address:</strong> {poi.address}</p>}
            {poi.rating && <p><strong>Rating:</strong> {poi.rating}/5</p>}
            {poi.imageUrl && (
              <img 
                src={poi.imageUrl} 
                alt={poi.name}
                style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px' }}
              />
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default POIMarker;