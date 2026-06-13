<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoRedirect;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SeoRedirectController extends Controller
{
    public function index(): Response
    {
        $redirects = SeoRedirect::latest()->paginate(15);
        return Inertia::render('SeoRedirects/Index', ['redirects' => $redirects]);
    }

    public function create(): Response
    {
        return Inertia::render('SeoRedirects/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'old_url' => 'required|string|unique:seo_redirects,old_url',
            'new_url' => 'required|string',
            'http_code' => 'required|integer|in:301,302',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validated['old_url'] === $validated['new_url']) {
            return redirect()->back()->withErrors(['old_url' => 'Source and target URLs cannot be identical.']);
        }

        $redirect = SeoRedirect::create($validated);

        ActivityLogger::log('CREATE', 'seo_redirects', "Created redirect '{$redirect->old_url}' -> '{$redirect->new_url}'", null, $redirect->toArray());

        return redirect()->route('admin.seo-redirects.index')->with('success', 'Redirect created successfully.');
    }

    public function edit(SeoRedirect $seoRedirect): Response
    {
        return Inertia::render('SeoRedirects/Form', ['redirect' => $seoRedirect]);
    }

    public function update(Request $request, SeoRedirect $seoRedirect): RedirectResponse
    {
        $validated = $request->validate([
            'old_url' => 'required|string|unique:seo_redirects,old_url,' . $seoRedirect->id,
            'new_url' => 'required|string',
            'http_code' => 'required|integer|in:301,302',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validated['old_url'] === $validated['new_url']) {
            return redirect()->back()->withErrors(['old_url' => 'Source and target URLs cannot be identical.']);
        }

        $oldValue = $seoRedirect->toArray();
        $seoRedirect->update($validated);

        ActivityLogger::log('UPDATE', 'seo_redirects', "Updated redirect '{$seoRedirect->old_url}' to '{$seoRedirect->new_url}'", $oldValue, $seoRedirect->toArray());

        return redirect()->route('admin.seo-redirects.index')->with('success', 'Redirect updated successfully.');
    }

    public function destroy(SeoRedirect $seoRedirect): RedirectResponse
    {
        $oldValue = $seoRedirect->toArray();
        $seoRedirect->delete();

        ActivityLogger::log('DELETE', 'seo_redirects', "Deleted redirect '{$oldValue['old_url']}'", $oldValue, null);

        return redirect()->route('admin.seo-redirects.index')->with('success', 'Redirect deleted successfully.');
    }
}
