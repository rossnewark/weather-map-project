export interface WeatherData {
    id: number;
    name: string;
    lat: number;
    lon: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }
  
  export interface PointOfInterest {
    id: string;
    name: string;
    lat: number;
    lon: number;
    category: string;
    description?: string;
    address?: string;
    rating?: number;
    imageUrl?: string;
  }
  
  export interface TransportStop {
    id: string;
    name: string;
    lat: number;
    lon: number;
    type: string; // bus, train, etc.
    routes?: string[];
    operators?: string[];
  }
  
  export interface MarkerIconOptions {
    color: string;
    size?: number;
    borderColor?: string;
  }