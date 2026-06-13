<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::orderBy('order_index')->paginate(15);
        return Inertia::render('Banners/Index', ['banners' => $banners]);
    }

    public function create(): Response
    {
        return Inertia::render('Banners/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'required|string',
            'link_url' => 'nullable|string|max:255',
            'order_index' => 'required|integer',
            'status' => 'required|in:active,inactive',
        ]);

        $banner = Banner::create($validated);

        ActivityLogger::log('CREATE', 'banners', "Created banner '{$banner->title}'", null, $banner->toArray());

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('Banners/Form', ['banner' => $banner]);
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'required|string',
            'link_url' => 'nullable|string|max:255',
            'order_index' => 'required|integer',
            'status' => 'required|in:active,inactive',
        ]);

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
