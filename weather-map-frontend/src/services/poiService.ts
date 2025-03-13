import { PointOfInterest } from '../types/interfaces';

// This will be your backend API URL for POIs
const API_URL = 'http://localhost:5000/api/pois';

export const fetchPointsOfInterest = async (): Promise<PointOfInterest[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch points of interest');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching points of interest:', error);
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