<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Media::latest();
        if ($request->filled('search')) $query->where('original_name', 'like', "%{$request->search}%");
        return Inertia::render('Media/Index', [
            'media' => $query->paginate(24)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'files' => ['required', 'array', 'max:10'],
            'files.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:5120'],
        ]);
        foreach ($validated['files'] as $file) {
            $path = $file->store('media/'.now()->format('Y/m'), 'public');
            Media::create([
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'uploaded_by' => $request->user()->id,
            ]);
        }
        ActivityLogger::log('CREATE', 'media', 'Uploaded '.count($validated['files']).' media files');
        return back()->with('success', 'Đã tải file lên thư viện.');
    }

    public function update(Request $request, Media $medium): RedirectResponse
    {
        $validated = $request->validate(['alt_text' => ['nullable', 'string', 'max:255']]);
        $medium->update($validated);
        return back()->with('success', 'Đã cập nhật mô tả ảnh.');
    }

    public function destroy(Media $medium): RedirectResponse
    {
        if (Banner::where('image_path', $medium->url)->exists()) {
            return back()->with('error', 'Không thể xóa vì ảnh đang được một banner sử dụng.');
        }
        Storage::disk($medium->disk)->delete($medium->path);
        $medium->delete();
        ActivityLogger::log('DELETE', 'media', "Deleted media '{$medium->original_name}'");
        return back()->with('success', 'Đã xóa file khỏi thư viện.');
    }
}
