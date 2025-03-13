// Function to get the user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };
  
  // Function to get user location and return as [lat, lon] array
  export const getUserLocationCoordinates = async (): Promise<[number, number]> => {
    try {
      const position = await getCurrentLocation();
      return [position.coords.latitude, position.coords.longitude];
    } catch (error) {
      console.error('Error getting user location:', error);
      // Default to London coordinates if location access fails
      return [51.5074, -0.1278];
    }
  };