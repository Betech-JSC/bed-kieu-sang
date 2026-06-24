<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    /**
     * Get paginated chat messages (chronological order)
     */
    public function index(Request $request): JsonResponse
    {
        $userId = auth()->id();
        $beforeId = $request->query('before_id');

        $query = AiChatMessage::where('user_id', $userId);

        if ($beforeId) {
            $query->where('id', '<', $beforeId);
        }

        // Fetch 15 messages, ordered by id desc to get the most recent ones first
        $messages = $query->orderBy('id', 'desc')
            ->limit(15)
            ->get();

        // Reverse to return them in chronological order
        return response()->json([
            'messages' => $messages->reverse()->values(),
            'has_more' => $messages->count() === 15,
        ]);
    }

    /**
     * Store user message, call Gemini API, and store response
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $userId = auth()->id();
        $userText = $request->input('message');

        // 1. Save user message
        $userMessage = AiChatMessage::create([
            'user_id' => $userId,
            'role' => 'user',
            'message' => $userText,
        ]);

        // 2. Retrieve history for context (last 10 messages, including the current one, in chronological order)
        $history = AiChatMessage::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->limit(11) // current + 10 history
            ->get()
            ->reverse()
            ->values();

        // 3. Check Gemini API key
        $apiKey = config('services.gemini.key');
        if (empty($apiKey)) {
            $errorText = 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.';
            $modelMessage = AiChatMessage::create([
                'user_id' => $userId,
                'role' => 'model',
                'message' => $errorText,
            ]);

            return response()->json([
                'user_message' => $userMessage,
                'model_message' => $modelMessage,
            ]);
        }

        // 4. Build context payload for Gemini
        $contents = [];
        foreach ($history as $msg) {
            // Ensure the role is either 'user' or 'model'
            $contents[] = [
                'role' => $msg->role,
                'parts' => [
                    ['text' => $msg->message]
                ]
            ];
        }

        try {
            // 5. Call Gemini API
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={$apiKey}";
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => $contents,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $responseText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if (!$responseText) {
                    $responseText = 'Sorry, I received an empty response from Gemini.';
                    Log::warning('Gemini API empty response', ['response' => $data]);
                }
            } else {
                $errorMsg = $response->json('error.message') ?? $response->body();
                $responseText = "Error calling Gemini API: {$errorMsg}";
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            $responseText = "Sorry, an unexpected error occurred: {$e->getMessage()}";
            Log::error('Gemini API exception', ['exception' => $e]);
        }

        // 6. Save model response
        $modelMessage = AiChatMessage::create([
            'user_id' => $userId,
            'role' => 'model',
            'message' => $responseText,
        ]);

        return response()->json([
            'user_message' => $userMessage,
            'model_message' => $modelMessage,
        ]);
    }
}
