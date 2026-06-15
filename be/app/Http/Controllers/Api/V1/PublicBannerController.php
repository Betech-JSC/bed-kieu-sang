<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;

class PublicBannerController extends Controller
{
    public function index(): JsonResponse
    {
        $banners = Banner::where('status', 'active')
            ->orderBy('order_index')
            ->get();

        return response()->json(['data' => $banners]);
    }
}
