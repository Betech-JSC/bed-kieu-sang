<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Faqs/Index', ['faqs' => Faq::orderBy('sort_order')->paginate(20)]);
    }

    public function create(): Response { return Inertia::render('Faqs/Form'); }
    public function edit(Faq $faq): Response { return Inertia::render('Faqs/Form', ['faq' => $faq]); }

    public function store(Request $request): RedirectResponse
    {
        $faq = Faq::create($this->validated($request));
        ActivityLogger::log('CREATE', 'faqs', "Created FAQ '{$faq->question}'", null, $faq->toArray());
        return redirect()->route('admin.faqs.index')->with('success', 'Đã tạo câu hỏi thường gặp.');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $old = $faq->toArray();
        $faq->update($this->validated($request));
        ActivityLogger::log('UPDATE', 'faqs', "Updated FAQ '{$faq->question}'", $old, $faq->toArray());
        return redirect()->route('admin.faqs.index')->with('success', 'Đã cập nhật câu hỏi thường gặp.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $old = $faq->toArray();
        $faq->delete();
        ActivityLogger::log('DELETE', 'faqs', "Deleted FAQ '{$old['question']}'", $old);
        return redirect()->route('admin.faqs.index')->with('success', 'Đã xóa câu hỏi thường gặp.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string', 'max:10000'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:active,inactive'],
        ]);
    }
}
