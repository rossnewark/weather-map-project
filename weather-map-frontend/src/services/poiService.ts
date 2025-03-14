import { PointOfInterest } from '../types/interfaces';

// Define the base URL for the API it differs for DEV and PROD
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Function to get points of interest from the API
export const getPointsOfInterest = async (): Promise<PointOfInterest[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pois`);
    if (!response.ok) {
      throw new Error('Failed to get the points of interest');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting the points of interest:', error);
    throw error;
  }
};

// Function to categorize POIs by type
export const categorizePOIs = (pois: PointOfInterest[]): Record<string, PointOfInterest[]> => {
  return pois.reduce((acc, poi) => {
    const category = poi.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(poi);
    return acc;
  }, {} as Record<string, PointOfInterest[]>);
};