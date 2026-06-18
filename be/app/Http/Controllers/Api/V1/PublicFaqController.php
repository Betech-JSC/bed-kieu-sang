<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;

class PublicFaqController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Faq::where('status', 'active')->orderBy('sort_order')->get()]);
    }
}
