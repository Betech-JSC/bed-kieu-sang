<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PageController extends Controller
{
    public function index(): Response
    {
        $pages = Page::latest()->paginate(15);
        return Inertia::render('Pages/Index', ['pages' => $pages]);
    }

    public function create(): Response
    {
        return Inertia::render('Pages/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:pages,slug',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_desc' => 'nullable|string',
            'status' => 'required|in:draft,published',
        ]);

        $page = Page::create($validated);

        ActivityLogger::log('CREATE', 'pages', "Created static page '{$page->title}'", null, $page->toArray());

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully.');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Pages/Form', ['page' => $page]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:pages,slug,' . $page->id,
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_desc' => 'nullable|string',
            'status' => 'required|in:draft,published',
        ]);

        $oldValue = $page->toArray();
        $page->update($validated);

        ActivityLogger::log('UPDATE', 'pages', "Updated static page '{$page->title}'", $oldValue, $page->toArray());

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $oldValue = $page->toArray();
        $page->delete();

        ActivityLogger::log('DELETE', 'pages', "Deleted static page '{$oldValue['title']}'", $oldValue, null);

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }
}
