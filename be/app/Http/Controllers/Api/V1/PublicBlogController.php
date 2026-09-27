<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicBlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::with('category')
            ->where('status', 'published')
            ->where('published_at', '<=', now());

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $categorySlug = $request->input('category');
                $q->where(function ($catQuery) use ($categorySlug) {
                    $catQuery->where('slug', $categorySlug)
                        ->orWhere('slug_en', $categorySlug);
                });
            });
        }

        $posts = $query->latest()->paginate($request->input('per_page', 9));

        return response()->json($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::with('category')
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('slug_en', $slug);
            })
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        $products = [];
        if (!empty($post->recommended_product_ids)) {
            $products = \App\Models\Product::with('category')
                ->whereIn('id', $post->recommended_product_ids)
                ->where('status', 'active')
                ->get();
        }
        $post->setAttribute('recommended_products', $products);

        return response()->json($post);
    }
}
