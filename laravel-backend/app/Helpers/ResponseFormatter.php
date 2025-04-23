<?php

namespace App\Helpers;

class ResponseFormatter
{
    public static function success($data = null, string $message = 'Success', int $code = 200): array
    {
        return [
            'status' => 'success',
            'message' => $message,
            'code' => $code,
            'data' => $data,
        ];
    }

    public static function error(string $message = 'Error', int $code = 400, $errors = null): array
    {
        return [
            'status' => 'error',
            'message' => $message,
            'code' => $code,
            'errors' => $errors,
        ];
    }

    public static function formatWeatherData(array $weatherData): array
    {
        $current = $weatherData['current'];
        $location = $weatherData['location'];

        return [
            'current' => [
                'temp' => $current['main']['temp'],
                'feels_like' => $current['main']['feels_like'],
                'temp_min' => $current['main']['temp_min'],
                'temp_max' => $current['main']['temp_max'],
                'humidity' => $current['main']['humidity'],
                'weather' => [
                    'id' => $current['weather'][0]['id'],
                    'main' => $current['weather'][0]['main'],
                    'description' => $current['weather'][0]['description'],
                    'icon' => $current['weather'][0]['icon']
                ],
                'wind' => [
                    'speed' => $current['wind']['speed'],
                    'deg' => $current['wind']['deg'],
                    'direction' => self::getWindDirection($current['wind']['deg'])
                ],
                'date' => date('Y-m-d H:i:s', $current['dt']),
                'formatted_date' => date('l, d M Y', $current['dt'])
            ],
            'location' => [
                'name' => $location['name'],
                'country' => $location['country'],
                'state' => $location['state'] ?? null,
                'lat' => $location['lat'],
                'lon' => $location['lon']
            ],
            'forecasts' => array_map(function ($day) {
                return [
                    'date' => $day['date'],
                    'formatted_date' => date('D, d M', $day['timestamp']),
                    'temp' => $day['temp'],
                    'temp_min' => $day['temp_min'],
                    'temp_max' => $day['temp_max'],
                    'humidity' => $day['humidity'],
                    'weather' => $day['weather'],
                    'wind' => [
                        'speed' => $day['wind']['speed'],
                        'deg' => $day['wind']['deg'],
                        'direction' => self::getWindDirection($day['wind']['deg'])
                    ]
                ];
            }, $weatherData['daily_forecasts'])
        ];
    }

    private static function getWindDirection(float $degrees): string
    {
        $directions = [
            'N', 'NNE', 'NE', 'ENE',
            'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW',
            'W', 'WNW', 'NW', 'NNW'
        ];

        $index = round($degrees / 22.5) % 16;
        return $directions[$index];
    }
}
