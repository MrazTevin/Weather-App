"use client"

import type { DailyForecast, TemperatureUnit } from "@/types/weather"
import AnimatedWeatherIcon from "./AnimatedWeatherIcon"

interface WeatherCardProps {
  forecast: DailyForecast
  unit: TemperatureUnit
  isSelected?: boolean
  onClick: () => void
}

export default function WeatherCard({ forecast, unit, isSelected = false, onClick }: WeatherCardProps) {
  const { date, minTemp, maxTemp, condition } = forecast

  const formatTemp = (temp: number) => {
    if (unit === "fahrenheit") {
      // Convert Celsius to Fahrenheit
      temp = (temp * 9) / 5 + 32
    }
    return Math.round(temp)
  }

  return (
    <div
      className={`bg-white/10 dark:bg-slate-700/30 rounded-xl p-4 text-center backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
      }`}
      onClick={onClick}
    >
      <p className="font-medium mb-2">{date}</p>
      <div className="flex justify-center my-3">
        <AnimatedWeatherIcon condition={condition} className="w-12 h-12" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {formatTemp(minTemp)}°-{formatTemp(maxTemp)}°
      </p>
    </div>
  )
}
