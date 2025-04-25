"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  WeatherData,
  WeatherCondition,
  DailyForecast,
  ApiCurrentWeatherResponse,
  ApiForecastItemResponse
} from "@/types/weather"

const BASE_URL = "https://laravel-backend.fly.dev"

export function useWeather(city: string) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedForecast, setSelectedForecast] = useState<DailyForecast | null>(null)

  const mapWeatherCondition = useCallback((condition: string): WeatherCondition => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) return "stormy"
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "rainy"
    if (conditionLower.includes("snow")) return "snowy"
    if (conditionLower.includes("cloud") && !conditionLower.includes("clear")) {
      return conditionLower.includes("scattered") || conditionLower.includes("few") || conditionLower.includes("broken") 
        ? "partly-cloudy" 
        : "cloudy"
    }
    return "sunny"
  }, [])

  const formatForecastDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [])

  const mapApiDataToWeatherData = useCallback((
    currentData: ApiCurrentWeatherResponse,
    forecastData: ApiForecastItemResponse[]
  ): WeatherData => {
    const getWindDirection = (degrees: number): string => {
      const directions = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
      ]
      return directions[Math.round(degrees / 22.5) % 16]
    }

    const current = {
      temp: currentData.current.temp,
      feelsLike: currentData.current.temp,
      condition: mapWeatherCondition(currentData.current.weather.main),
      description: currentData.current.weather.description,
      humidity: currentData.current.humidity,
      windSpeed: currentData.current.wind.speed,
      windDirection: currentData.current.wind.direction ? 
        getWindDirection(currentData.current.wind.direction) : 'N/A',
    }

    const forecasts = forecastData.slice(0, 3).map((day): DailyForecast => ({
      date: formatForecastDate(day.date),
      fullDate: day.date,
      minTemp: day.temp - 2,
      maxTemp: day.temp + 2,
      temp: day.temp,
      condition: mapWeatherCondition(day.weather.main),
      description: day.weather.description,
      humidity: day.humidity,
      windSpeed: day.wind.speed,
      windDirection: day.wind.deg ? getWindDirection(day.wind.deg) : "N/A",
    }))

    return {
      location: {
        name: currentData.location.name,
        country: currentData.location.country,
        lat: currentData.location.lat || 0,
        lon: currentData.location.lon || 0,
      },
      current,
      forecast: forecasts,
      formattedDate: currentData.current.formatted_date || new Date().toISOString(),
    }
  }, [mapWeatherCondition, formatForecastDate])

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return

      setIsLoading(true)
      setError(null)
      setSelectedForecast(null)

      try {
        const currentResponse = await fetch(`${BASE_URL}/api/weather?city=${encodeURIComponent(city)}`)
        if (!currentResponse.ok) throw new Error("Weather data not found")
        const currentData = await currentResponse.json()

        let { lat, lon } = currentData.data.location
        if (!lat || !lon) {
          const searchResponse = await fetch(`${BASE_URL}/api/weather/search?q=${encodeURIComponent(city)}`)
          if (!searchResponse.ok) throw new Error("Failed to get coordinates")
          const searchData = await searchResponse.json()
          lat = searchData.data[0]?.lat
          lon = searchData.data[0]?.lon
          if (!lat || !lon) throw new Error("Location coordinates not found")
        }

        const forecastResponse = await fetch(`${BASE_URL}/api/weather/forecast?lat=${lat}&lon=${lon}&units=metric`)
        if (!forecastResponse.ok) throw new Error("Failed to fetch forecast")
        const forecastData = await forecastResponse.json()

        setWeatherData(mapApiDataToWeatherData(currentData.data, forecastData.data))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch weather data")
        console.error("Error fetching weather data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [city, mapApiDataToWeatherData])

  const selectForecast = (forecast: DailyForecast) => {
    setSelectedForecast(forecast)
  }

  return { weatherData, isLoading, error, selectedForecast, selectForecast }
}