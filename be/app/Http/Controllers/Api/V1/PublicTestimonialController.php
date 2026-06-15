<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class PublicTestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::where('status', 'approved')
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->get();

        return response()->json(['data' => $testimonials]);
    }
}
