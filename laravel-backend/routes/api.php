<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\Api\ApiStatusController;


// Route::get('/weather', [WeatherController::class, 'getWeather']); 
Route::prefix('weather')->group(function () {
    Route::get('/', [WeatherController::class, 'getWeatherByCity']);
    Route::get('/search', [WeatherController::class, 'searchCities']);
    Route::post('/convert', [WeatherController::class, 'convertTemperature']);
    Route::get('/forecast', [WeatherController::class, 'getWeatherForecastByCoordinates']);
});

Route::get('/status', [ApiStatusController::class, 'getStatus']);
    
Route::get('/docker-test', function() {
    return response()->json([
        'container_os' => php_uname(),
        'routes_loaded' => Route::getRoutes()->getRoutesByName(),
        'controller_exists' => class_exists('App\Http\Controllers\Api\WeatherController')
    ]);
});