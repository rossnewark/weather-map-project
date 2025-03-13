import { WeatherData } from '../types/interfaces';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};