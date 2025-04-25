"use client"

import { useState, useEffect } from "react"
import type { WeatherData, WeatherCondition, DailyForecast } from "@/types/weather"

// Base URL for the Laravel API
const BASE_URL = "https://laravel-backend.fly.dev"

export function useWeather(city: string) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedForecast, setSelectedForecast] = useState<DailyForecast | null>(null)

  // Function to map weather condition from API to our app's condition types
  const mapWeatherCondition = (condition: string): WeatherCondition => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) return "stormy"
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "rainy"
    if (conditionLower.includes("snow")) return "snowy"
    if (conditionLower.includes("cloud") && !conditionLower.includes("clear")) {
      if (conditionLower.includes("scattered") || conditionLower.includes("few") || conditionLower.includes("broken")) {
        return "partly-cloudy"
      }
      return "cloudy"
    }
    return "sunny" // Default for clear, sun, etc.
  }

  // Function to format date from API (e.g., "2025-04-25" to "Apr 25")
  const formatForecastDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Function to select a forecast day
  const selectForecast = (forecast: DailyForecast) => {
    setSelectedForecast(forecast)
  }

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return

      setIsLoading(true)
      setError(null)
      setSelectedForecast(null)

      try {
        // Step 1: Fetch current weather data
        const currentWeatherUrl = `${BASE_URL}/api/weather?city=${encodeURIComponent(city)}`
        const currentResponse = await fetch(currentWeatherUrl)

        if (!currentResponse.ok) {
          throw new Error(`Weather data not found. Please check the city name.`)
        }

        const currentData = await currentResponse.json()

        // Step 2: Get coordinates for forecast
        const { lat, lon } = currentData.data.location

        // If we don't have coordinates in the response, we need to search for them
        let latitude = lat
        let longitude = lon

        if (!latitude || !longitude) {
          const searchUrl = `${BASE_URL}/api/weather/search?q=${encodeURIComponent(city)}`
          const searchResponse = await fetch(searchUrl)

          if (!searchResponse.ok) {
            throw new Error("Failed to get location coordinates")
          }

          const searchData = await searchResponse.json()
          latitude = searchData.data[0]?.lat
          longitude = searchData.data[0]?.lon

          if (!latitude || !longitude) {
            throw new Error("Location coordinates not found")
          }
        }

        // Step 3: Fetch forecast data
        const forecastUrl = `${BASE_URL}/api/weather/forecast?lat=${latitude}&lon=${longitude}&units=metric`
        const forecastResponse = await fetch(forecastUrl)

        if (!forecastResponse.ok) {
          throw new Error("Failed to fetch forecast data")
        }

        const forecastData = await forecastResponse.json()

        // Map API data to our app's data structure
        const mappedData = mapApiDataToWeatherData(currentData.data, forecastData.data)
        setWeatherData(mappedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch weather data. Please try again.")
        console.error("Error fetching weather data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [city])

  // Map API data to our app's data structure
  const mapApiDataToWeatherData = (currentData: any, forecastData: any): WeatherData => {
    // Process current weather data
    const current = {
      temp: currentData.current.temp,
      feelsLike: currentData.current.temp, // API doesn't provide feels_like
      condition: mapWeatherCondition(currentData.current.weather.main),
      description: currentData.current.weather.description,
      humidity: currentData.current.humidity,
      windSpeed: currentData.current.wind.speed,
      windDirection: currentData.current.wind.direction,
    }

    // Process forecast data (limit to 3 days)
    const forecasts = forecastData.slice(0, 3).map((day: any) => ({
      date: formatForecastDate(day.date),
      fullDate: day.date,
      minTemp: day.temp - 2, // Mock min temp (API doesn't provide min/max)
      maxTemp: day.temp + 2, // Mock max temp
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
        lat: 0, 
        lon: 0, 
      },
      current,
      forecast: forecasts,
      formattedDate: currentData.current.formatted_date,
    }
  }

  // Get wind direction from degrees
  function getWindDirection(degrees: number): string {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  return { weatherData, isLoading, error, selectedForecast, selectForecast }
}
