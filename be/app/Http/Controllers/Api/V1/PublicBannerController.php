<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicBannerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $banners = Banner::where('status', 'active')
            ->when($request->filled('page'), fn ($query) => $query->whereIn('page_key', [$request->input('page'), 'all']))
            ->when($request->filled('position'), fn ($query) => $query->where('position', $request->input('position')))
            ->orderBy('order_index')
            ->get();

        return response()->json(['data' => $banners]);
    }
}
