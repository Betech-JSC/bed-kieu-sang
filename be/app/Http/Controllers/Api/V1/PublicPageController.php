<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PublicPageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = Page::where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('slug_en', $slug);
            })
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($page);
    }
}
