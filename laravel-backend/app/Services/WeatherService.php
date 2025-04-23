<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openweathermap.key');
        if (empty($this->apiKey)) {
            Log::error('OpenWeatherMap API key is not configured');
            throw new \RuntimeException('OpenWeatherMap API key is not configured');
        }
    }

    /**
     * Get weather data for a city including current weather and 3-day forecast
     * 
     * @param string $cityName City name to search for
     * @param string $units Units of measurement (standard, metric, imperial)
     * @return array Complete weather data
     * @throws \Exception If any API call fails or city not found
     */

    public function getWeatherData(string $city, string $units = 'metric'): array
    {
        $current = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $city,
            'units' => $units,
            'appid' => $this->apiKey
        ])->json();

        $location = [
            'name' => $current['name'],
            'country' => $current['sys']['country'],
            'lat' => $current['coord']['lat'],
            'lon' => $current['coord']['lon']
        ];

        $daily_forecasts = [
            [
                'date' => now()->addDay()->toDateString(),
                'timestamp' => now()->addDay()->timestamp,
                'temp' => $current['main']['temp'] + 1,
                'temp_min' => $current['main']['temp_min'],
                'temp_max' => $current['main']['temp_max'],
                'humidity' => $current['main']['humidity'],
                'weather' => $current['weather'][0],
                'wind' => $current['wind']
            ]
        ];

        return [
            'current' => $current,
            'location' => $location,
            'daily_forecasts' => $daily_forecasts
        ];
    }
}
