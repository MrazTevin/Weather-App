import type { WeatherCondition } from "@/types/weather"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun } from "lucide-react"

export function getWeatherIcon(condition: WeatherCondition) {
  switch (condition) {
    case "sunny":
      return Sun
    case "partly-cloudy":
      return CloudSun
    case "cloudy":
      return Cloud
    case "rainy":
      return CloudRain
    case "stormy":
      return CloudLightning
    case "snowy":
      return CloudSnow
    default:
      return Sun
  }
}
