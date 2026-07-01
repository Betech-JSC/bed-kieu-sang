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
        $model = config('services.gemini.model', 'gemini-2.5-flash');
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
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
            
            $systemInstruction = "Bạn là Trợ lý AI của thương hiệu \"Xông Nhà Tẩy Uế\" (Xông Nhà Tẩy Uế). Hãy tư vấn và hỗ trợ khách hàng dựa trên các thông tin sản phẩm sau:\n\n"
                . "1. Phân loại sản phẩm và công dụng:\n"
                . "- Nhập trạch, chuyển nhà: nên khuyên chọn loại \"22 loại thảo mộc\".\n"
                . "- Công việc không ổn định, khó khăn làm ăn: nên khuyên chọn \"loại gai\".\n"
                . "- Làm thơm căn phòng: chọn \"Trầm\", hoặc \"gói VIP\", và \"Gừng\".\n"
                . "- Tốt cho sức khỏe: Chọn \"Ngải cứu\" và \"Gừng\".\n\n"
                . "2. Cách sử dụng (tùy theo loại nhà):\n"
                . "- Nhà phố: đốt lấy khói (bằng than hoặc lửa).\n"
                . "- Nhà chung cư: Nấu nước hoặc xông bằng hơi.\n\n"
                . "3. Quy tắc giao tiếp:\n"
                . "- Luôn trả lời bằng tiếng Việt lịch sự, chu đáo, ấm áp và chuyên nghiệp.\n"
                . "- Khi khách hàng cần hỗ trợ tư vấn sâu hơn hoặc có thắc mắc khác, hãy luôn khuyên hoặc mời khách hàng để lại thông tin liên hệ (số điện thoại/email) để được nhân viên liên hệ tư vấn chuyên sâu.";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => $contents,
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $systemInstruction]
                    ]
                ]
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
