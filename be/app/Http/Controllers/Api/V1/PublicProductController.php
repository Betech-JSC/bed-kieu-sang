<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category')->where('status', 'active');

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->input('category'));
            });
        }

        if ($request->boolean('best_seller')) {
            $query
                ->where('is_best_seller', true)
                ->orderByRaw('(channel_one_sales + channel_two_sales + virtual_sales + real_sales) desc');
        } else {
            $query->latest();
        }

        $products = $query->paginate($request->input('per_page', 12));

        return response()->json($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json($product);
    }

    public function categories(Request $request): JsonResponse
    {
        $type = $request->input('type', 'product');
        $categories = \App\Models\Category::where('type', $type)->get();
        return response()->json($categories);
    }
}
