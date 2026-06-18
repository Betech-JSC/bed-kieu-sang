<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Media;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::orderBy('order_index')->paginate(15);
        return Inertia::render('Banners/Index', ['banners' => $banners]);
    }

    public function create(): Response
    {
        return Inertia::render('Banners/Form', ['media' => Media::latest()->limit(100)->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'required_without:image|nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'link_url' => 'nullable|string|max:255',
            'page_key' => 'required|in:home,products,product,blog,contact,about,all',
            'position' => 'required|in:hero,top,content,bottom',
            'order_index' => 'required|integer',
            'status' => 'required|in:active,inactive',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $validated['image_path'] = Storage::disk('public')->url($path);
        }

        unset($validated['image']);
        $banner = Banner::create($validated);

        ActivityLogger::log('CREATE', 'banners', "Created banner '{$banner->title}'", null, $banner->toArray());

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('Banners/Form', ['banner' => $banner, 'media' => Media::latest()->limit(100)->get()]);
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'link_url' => 'nullable|string|max:255',
            'page_key' => 'required|in:home,products,product,blog,contact,about,all',
            'position' => 'required|in:hero,top,content,bottom',
            'order_index' => 'required|integer',
            'status' => 'required|in:active,inactive',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $validated['image_path'] = Storage::disk('public')->url($path);
        }

        unset($validated['image']);
        $oldValue = $banner->toArray();
        $banner->update($validated);

        ActivityLogger::log('UPDATE', 'banners', "Updated banner '{$banner->title}'", $oldValue, $banner->toArray());

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $oldValue = $banner->toArray();
        $banner->delete();

        ActivityLogger::log('DELETE', 'banners', "Deleted banner '{$oldValue['title']}'", $oldValue, null);

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }
}
