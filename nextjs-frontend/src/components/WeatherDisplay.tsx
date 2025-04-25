"use client"

import type { WeatherData, TemperatureUnit, DailyForecast } from "@/types/weather"
import WeatherCard from "./WeatherCard"
import AnimatedWeatherIcon from "./AnimatedWeatherIcon"
import { Wind } from "lucide-react"

interface WeatherDisplayProps {
  weatherData: WeatherData
  unit: TemperatureUnit
  selectedForecast: DailyForecast | null
  onSelectForecast: (forecast: DailyForecast) => void
}

export default function WeatherDisplay({ weatherData, unit, selectedForecast, onSelectForecast }: WeatherDisplayProps) {
  const { current, forecast, location, formattedDate } = weatherData

  // Determine which data to display based on whether a forecast is selected
  const displayData = selectedForecast || current

  const formatTemp = (temp: number) => {
    if (unit === "fahrenheit") {
      // Convert Celsius to Fahrenheit
      temp = (temp * 9) / 5 + 32
    }
    return Math.round(temp)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Weather Section */}
      <div className="bg-white/10 dark:bg-slate-700/20 rounded-xl p-6 backdrop-blur-sm flex flex-col items-center md:items-start shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center md:items-start mb-4">
          <AnimatedWeatherIcon condition={displayData.condition} />
          <div className="text-5xl font-bold mb-1 mt-2">
            {formatTemp(displayData.temp)}
            {unit === "celsius" ? "°C" : "°F"}
          </div>
          <div className="text-xl text-slate-600 dark:text-slate-300 capitalize">
            {displayData.description || displayData.condition}
          </div>
        </div>
        <div className="mt-auto text-center md:text-left">
          <div className="text-sm text-slate-500 dark:text-slate-400">{formattedDate}</div>
          <div className="text-lg font-medium">
            {location.name}, {location.country}
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="md:col-span-2">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">3-Day Forecast</h2>
          <div className="grid grid-cols-3 gap-3">
            {forecast.map((day, index) => (
              <WeatherCard
                key={index}
                forecast={day}
                unit={unit}
                isSelected={selectedForecast?.date === day.date}
                onClick={() => onSelectForecast(day)}
              />
            ))}
          </div>
        </div>

        {/* Additional Weather Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-slate-700/20 rounded-xl p-5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl">
            <h3 className="text-slate-500 dark:text-slate-400 mb-2">Wind Status</h3>
            <div className="flex items-center">
              <div>
                <div className="text-3xl font-bold mb-1">{displayData.windSpeed} km/h</div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Wind size={16} className="mr-1" />
                  <span>{displayData.windDirection}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-slate-700/20 rounded-xl p-5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl">
            <h3 className="text-slate-500 dark:text-slate-400 mb-2">Humidity</h3>
            <div className="text-3xl font-bold mb-3">{displayData.humidity}%</div>
            <div className="w-full bg-slate-300 dark:bg-slate-600/50 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${displayData.humidity}%` }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-slate-500 dark:text-slate-400">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
