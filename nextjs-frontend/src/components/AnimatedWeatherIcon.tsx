"use client"

import { useEffect, useRef } from "react"
import type { WeatherCondition } from "@/types/weather"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun } from "lucide-react"

interface AnimatedWeatherIconProps {
  condition: WeatherCondition
  className?: string
}

export default function AnimatedWeatherIcon({ condition, className = "w-24 h-24" }: AnimatedWeatherIconProps) {
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (iconRef.current) {
      // Reset animations when condition changes
      iconRef.current.style.animation = "none"
      void iconRef.current.offsetWidth // Trigger reflow
      iconRef.current.style.animation = ""
    }
  }, [condition])

  const renderIcon = () => {
    switch (condition) {
      case "sunny":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <Sun className={`${className} text-yellow-400 animate-pulse`} />
            <div className="absolute inset-0 bg-gradient-radial from-yellow-300/30 to-transparent animate-ping opacity-75 rounded-full"></div>
          </div>
        )
      case "partly-cloudy":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <CloudSun className={`${className} text-gray-300`} />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 text-yellow-400">
              <div className="animate-pulse">
                <Sun className="w-full h-full" />
              </div>
            </div>
          </div>
        )
      case "cloudy":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <Cloud className={`${className} text-gray-400`} />
            <div className="absolute top-0 left-0 animate-float opacity-70">
              <Cloud className={`w-1/2 h-1/2 text-gray-300`} />
            </div>
          </div>
        )
      case "rainy":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <CloudRain className={`${className} text-gray-400`} />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-blue-400 rounded-full animate-rain"
                  style={{
                    left: `${10 + i * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.7,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )
      case "stormy":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <CloudLightning className={`${className} text-gray-500`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/3 h-1/2 text-yellow-400 animate-flash">
                <CloudLightning className="w-full h-full" />
              </div>
            </div>
          </div>
        )
      case "snowy":
        return (
          <div className={`${className} relative`} ref={iconRef}>
            <CloudSnow className={`${className} text-gray-300`} />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full animate-snow"
                  style={{
                    left: `${10 + i * 20}%`,
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.9,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )
      default:
        return <Sun className={`${className} text-yellow-400`} />
    }
  }

  return renderIcon()
}
