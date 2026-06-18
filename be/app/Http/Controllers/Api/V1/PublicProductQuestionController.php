<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicProductQuestionController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $questions = $product->questions()->where('status', 'approved')->latest('answered_at')->get(['id', 'customer_name', 'question', 'answer', 'answered_at']);
        return response()->json(['data' => $questions]);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:100'],
            'customer_email' => ['nullable', 'email', 'max:150'],
            'question' => ['required', 'string', 'min:10', 'max:2000'],
        ]);
        $product->questions()->create($validated);
        return response()->json(['success' => true, 'message' => 'Câu hỏi đã được gửi và đang chờ duyệt.'], 201);
    }
}
