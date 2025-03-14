import { WeatherData } from '../types/interfaces';

// Define the base URL for the API it differs for DEV and PROD
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Function to get weather data from the API
export const getWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather`);
    if (!response.ok) {
      throw new Error('Failed to get the weather data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting the weather data:', error);
    throw error;
  }
};

// Function to get the user's location coordinates
export const getWeatherIconUrl = (iconCode: string): string => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};