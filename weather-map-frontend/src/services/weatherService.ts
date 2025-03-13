import { WeatherData } from '../types/interfaces';

const API_URL = 'http://localhost:5000/api/weather';

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const response = await fetch(API_URL);
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