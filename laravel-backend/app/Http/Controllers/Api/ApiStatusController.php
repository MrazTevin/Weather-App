<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiStatusController extends Controller
{
    public function getStatus(Request $request)
    {
        return response()->json([
            'message' => '✅ Weather route is working perfectly!',
            'city' => $request->query('city'),
            'units' => $request->query('units', 'metric')
        ]);
    }
}