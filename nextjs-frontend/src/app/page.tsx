"use client"

import { useState } from "react"
import SearchBox from "@/components/SearchBox"
import UnitToggle from "@/components/UnitToggle"
import WeatherDisplay from "@/components/WeatherDisplay"
import { useWeather } from "@/hooks/useWeather"
import type { TemperatureUnit } from "@/types/weather"

export default function Home() {
  const [city, setCity] = useState<string>("Kakamega")
  const [unit, setUnit] = useState<TemperatureUnit>("celsius")

  const { weatherData, isLoading, error, selectedForecast, selectForecast } = useWeather(city)

  const handleSearch = (searchCity: string) => {
    setCity(searchCity)
  }

  const handleUnitToggle = (selectedUnit: TemperatureUnit) => {
    setUnit(selectedUnit)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">WeatherWise</h1>
          <div className="flex w-full md:w-auto gap-2 items-center">
            <div className="flex-1 md:w-80">
              <SearchBox onSearch={handleSearch} />
            </div>
            <UnitToggle activeUnit={unit} onToggle={handleUnitToggle} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : weatherData ? (
          <WeatherDisplay
            weatherData={weatherData}
            unit={unit}
            selectedForecast={selectedForecast}
            onSelectForecast={selectForecast}
          />
        ) : null}
      </div>
    </main>
  )
}
