export type TemperatureUnit = "celsius" | "fahrenheit"

export type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy" | "snowy"

export interface CurrentWeather {
  temp: number
  feelsLike: number
  condition: WeatherCondition
  description?: string
  humidity: number
  windSpeed: number
  windDirection: string
}

export interface DailyForecast {
  date: string
  fullDate?: string
  minTemp: number
  maxTemp: number
  temp: number
  condition: WeatherCondition
  description?: string
  humidity: number
  windSpeed: number
  windDirection: string
}

export interface Location {
  name: string
  country: string
  lat: number
  lon: number
}

export interface WeatherData {
  location: Location
  current: CurrentWeather
  forecast: DailyForecast[]
  formattedDate: string
}

// API Response Types
export interface ApiCurrentWeatherResponse {
    current: {
      temp: number
      weather: {
        main: string
        description: string
      }
      humidity: number
      wind: {
        speed: number
        direction?: number
        deg?: number
      }
      formatted_date?: string
    }
    location: {
      name: string
      country: string
      lat?: number
      lon?: number
    }
  }
  
  export interface ApiForecastItemResponse {
    date: string
    temp: number
    weather: {
      main: string
      description: string
    }
    humidity: number
    wind: {
      speed: number
      deg?: number
    }
  }
