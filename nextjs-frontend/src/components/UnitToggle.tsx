"use client"

import type { TemperatureUnit } from "../types/weather"

interface UnitToggleProps {
  activeUnit: TemperatureUnit
  onToggle: (unit: TemperatureUnit) => void
}

export default function UnitToggle({ activeUnit, onToggle }: UnitToggleProps) {
  return (
    <div className="join">
      <button
        className={`btn join-item ${activeUnit === "celsius" ? "btn-active" : ""} bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 border-slate-300 dark:border-slate-600 transition-colors duration-300`}
        onClick={() => onToggle("celsius")}
        aria-pressed={activeUnit === "celsius"}
      >
        °C
      </button>
      <button
        className={`btn join-item ${activeUnit === "fahrenheit" ? "btn-active" : ""} bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 border-slate-300 dark:border-slate-600 transition-colors duration-300`}
        onClick={() => onToggle("fahrenheit")}
        aria-pressed={activeUnit === "fahrenheit"}
      >
        °F
      </button>
    </div>
  )
}
