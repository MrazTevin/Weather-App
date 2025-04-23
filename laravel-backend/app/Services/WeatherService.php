<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;


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

    
     /**
     * Get coordinates for a city name using the Geocoding API
     * 
     * @param string $cityName Name of the city to search for
     * @param string|null $state State code (only for the US)
     * @param string|null $country Country code (ISO 3166)
     * @return array|null Coordinates [lat, lon] or null if not found
     * @throws \Exception If API call fails
     */
    
    public function getCoordinates(string $cityName, ?string $state = null, ?string $country = null): ?array
    {
        try {
            $query = $cityName;
            if ($state) {
                $query .= ",$state";
            }
            if ($country) {
                $query .= ",$country";
            }
            
            $response = Http::get("https://api.openweathermap.org/data/2.5/weather/geo/1.0/direct", [
                'q' => $query,
                'limit' => 1,
                'appid' => $this->apiKey
            ]);
            
            $response->throw();
            $data = $response->json();
            
            if (empty($data)) {
                Log::info("No coordinates found for city: $cityName");
                return null;
            }
            
            return [
                'lat' => $data[0]['lat'],
                'lon' => $data[0]['lon'],
                'name' => $data[0]['name'],
                'country' => $data[0]['country'],
                'state' => $data[0]['state'] ?? null,
            ];
        } catch (RequestException $e) {
            Log::error("Failed to get coordinates for $cityName: " . $e->getMessage());
            throw new \Exception("Failed to get coordinates: " . $e->getMessage(), 0, $e);
        }
    }

}
