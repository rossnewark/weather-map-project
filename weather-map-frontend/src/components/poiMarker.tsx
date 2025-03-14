import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PointOfInterest } from '../types/interfaces';

// Define the props for the POIMarker component
interface POIMarkerProps {
  poi: PointOfInterest;
}

// Define the POIMarker component
const POIMarker: React.FC<POIMarkerProps> = ({ poi }) => {
  // Get an icon based on POI category
  const getPOIIcon = (category: string) => {

    // Define FontAwesome icons and colors for different categories
    const categoryIcons: Record<string, { icon: string, color: string }> = {
      restaurant: { icon: 'fa-utensils', color: '#FF5733' },
      cafe: { icon: 'fa-coffee', color: '#C70039' },
      bar: { icon: 'fa-glass-martini-alt', color: '#900C3F' },
      attraction: { icon: 'fa-monument', color: '#581845' },
      hotel: { icon: 'fa-bed', color: '#FFC300' },
      shop: { icon: 'fa-shopping-bag', color: '#DAF7A6' },
      transport: { icon: 'fa-bus', color: '#3498DB' },
      park: { icon: 'fa-tree', color: '#2ECC71' },
      plaza: { icon: 'fa-landmark', color: '#9B59B6' },
      structure: { icon: 'fa-building', color: '#34495E' },
      default: { icon: 'fa-map-marker-alt', color: '#2E4053' }
    };
    // More categories can be added as needed
    
    // Category mapping for specific subcategories so that we can capture variants
    const categoryMapping: Record<string, string> = {
      // Restaurant types
      'french restaurant': 'restaurant',
      'burger joint': 'restaurant',
      'fish and chips shop': 'restaurant',
      'deli': 'restaurant',
      
      // Cafe types
      'café': 'cafe',
      'coffee shop': 'cafe',
      'pastry shop': 'cafe',
      
      // Shop types
      'toy store': 'shop',
      'computers and electronics retail': 'shop',
      'shopping plaza': 'shop',
    };
    
    const lowerCategory = category.toLowerCase();
    
    // Try to find direct match first
    let iconInfo = categoryIcons[lowerCategory];
    
    // If no direct match, try to find a mapping
    if (!iconInfo) {
      const mappedCategory = categoryMapping[lowerCategory];
      if (mappedCategory) {
        iconInfo = categoryIcons[mappedCategory];
      } else {
        // If still no match, check if the category contains any of our known categories
        for (const knownCategory in categoryIcons) {
          if (lowerCategory.includes(knownCategory)) {
            iconInfo = categoryIcons[knownCategory];
            break;
          }
        }
      }
    }
    
    // If still no match found, use the default marker
    if (!iconInfo) {
      iconInfo = categoryIcons.default;
    }
    
    // Create the div icon with FontAwesome
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: white; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.4); border: 2px solid ${iconInfo.color};">
          <i class="fas ${iconInfo.icon}" style="color: ${iconInfo.color}; font-size: 16px;"></i>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  // Return a marker with a popup for the point of interest
  // The popup could be extended to show more information or link to an external website
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