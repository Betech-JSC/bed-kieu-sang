<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\ProductQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductQuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ProductQuestion::with('product:id,name,slug')->latest();
        if ($request->filled('status')) $query->where('status', $request->status);
        return Inertia::render('ProductQuestions/Index', [
            'questions' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('status'),
        ]);
    }

    public function update(Request $request, ProductQuestion $productQuestion): RedirectResponse
    {
        $validated = $request->validate([
            'answer' => ['nullable', 'string', 'max:10000'],
            'status' => ['required', 'in:pending,approved,rejected'],
        ]);
        if ($validated['status'] === 'approved' && blank($validated['answer'])) {
            return back()->withErrors(['answer' => 'Cần nhập câu trả lời trước khi duyệt công khai.']);
        }
        $old = $productQuestion->toArray();
        $validated['answered_by'] = filled($validated['answer']) ? $request->user()->id : null;
        $validated['answered_at'] = filled($validated['answer']) ? now() : null;
        $productQuestion->update($validated);
        ActivityLogger::log('UPDATE', 'product_questions', "Answered product question #{$productQuestion->id}", $old, $productQuestion->toArray());
        return back()->with('success', 'Đã cập nhật hỏi đáp sản phẩm.');
    }

    public function destroy(ProductQuestion $productQuestion): RedirectResponse
    {
        $old = $productQuestion->toArray();
        $productQuestion->delete();
        ActivityLogger::log('DELETE', 'product_questions', "Deleted product question #{$old['id']}", $old);
        return back()->with('success', 'Đã xóa câu hỏi.');
    }
}
