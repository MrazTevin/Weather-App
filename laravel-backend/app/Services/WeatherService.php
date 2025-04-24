<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;


class WeatherService
{
    protected string $apiKey;
    // protected string $apiBaseUrl = 'https://api.openweathermap.org';

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
            
            $response = Http::get("https://api.openweathermap.org/geo/1.0/direct", [
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

    /**
     * Get 5-day weather forecast by coordinates
     * 
     * @param float $lat Latitude
     * @param float $lon Longitude
     * @param string $units Units of measurement (standard, metric, imperial)
     * @return array Forecast data
     * @throws \Exception If API call fails
     */

    public function getForecast(float $lat, float $lon, string $units = 'metric'): array
    {
        try {
            $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey
            ]);
            
            $response->throw();
            return $response->json();
        } catch (RequestException $e) {
            Log::error("Failed to get weather forecast: " . $e->getMessage());
            throw new \Exception("Failed to get weather forecast: " . $e->getMessage(), 0, $e);
        }
    }

     /**
     * Process 5-day/3-hour forecast into daily forecasts
     * 
     * @param array $forecastData Raw forecast data from API
     * @return array Processed daily forecasts (limited to 3 days as per requirements)
     */
    public function processDailyForecasts(array $forecastData): array
    {
        $dailyForecasts = [];
        $processedDays = [];
        $daysCount = 0;
        
        // Skip today and get next 3 days
        $tomorrow = strtotime('tomorrow 12:00:00');
        
        foreach ($forecastData['list'] as $forecast) {
            $forecastDate = $forecast['dt'];
            $day = date('Y-m-d', $forecastDate);
            
            // Skip forecasts for today
            if ($forecastDate < $tomorrow) {
                continue;
            }
            
            // If we already have this day and it's not a noon forecast, skip it
            if (isset($processedDays[$day])) {
                $currentHour = (int)date('H', $forecastDate);
                $currentDistance = abs($currentHour - 12);
                $storedHour = (int)date('H', $processedDays[$day]);
                $storedDistance = abs($storedHour - 12);
                
                if ($currentDistance >= $storedDistance) {
                    continue;
                }
            }
            
            
            $processedDays[$day] = $forecastDate;
            
            // update the daily forecast entry
            $dailyForecasts[$day] = [
                'date' => $day,
                'timestamp' => $forecastDate,
                'temp' => $forecast['main']['temp'],
                'temp_min' => $forecast['main']['temp_min'],
                'temp_max' => $forecast['main']['temp_max'],
                'humidity' => $forecast['main']['humidity'],
                'weather' => $forecast['weather'][0],
                'wind' => $forecast['wind'],
            ];
            
            // Limit to 3 days
            if (count($dailyForecasts) >= 3) {
                break;
            }
        }
        
        // Convert associative array to indexed array
        return array_values($dailyForecasts);
    }

}
