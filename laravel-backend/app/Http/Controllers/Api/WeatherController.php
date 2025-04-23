<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

/**
 * Weather API controller
 * 
 * Handles all weather-related API requests
 */
class WeatherController extends Controller
{

    protected WeatherService $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get weather data for a specified city
     * 
     * @param Request $request
     * @return JsonResponse
     */

    public function getWeatherByCity(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'city' => 'required|string|max:100',
            'units' => 'sometimes|string|in:standard,metric,imperial',
        ]);

        if ($validator->fails()) {
            return response()->json(
                ResponseFormatter::error('Validation error', 422, $validator->errors()),
                422
            );
        }

        try {
            $city = $request->input('city');
            $units = $request->input('units', 'metric');

            $weatherData = $this->weatherService->getWeatherData($city, $units);

            $formattedData = ResponseFormatter::formatWeatherData($weatherData);

            return response()->json(
                ResponseFormatter::success($formattedData, 'Weather data retrieved successfully')
            );
        } catch (\Exception $e) {
            $message = $e->getMessage();
            $code = $message === "City not found: {$request->input('city')}" ? 404 : 500;

            return response()->json(
                ResponseFormatter::error($message, $code),
                $code
            );
        }
    }
}
