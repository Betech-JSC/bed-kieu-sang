<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Testimonial::with('product')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('comment', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $testimonials = $query->paginate(15)->withQueryString();

        return Inertia::render('Reviews/Index', [
            'testimonials' => $testimonials,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'is_featured' => 'boolean',
            'status' => 'required|in:pending,approved,rejected',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'customer_avatar' => 'nullable|string',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('testimonials', 'public');
            $validated['customer_avatar'] = Storage::disk('public')->url($path);
        }

        unset($validated['avatar']);
        
        $testimonial = Testimonial::create($validated);

        ActivityLogger::log('CREATE', 'testimonials', "Created testimonial for customer '{$testimonial->customer_name}'", null, $testimonial->toArray());

        return redirect()->back()->with('success', 'Review created successfully.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        // When sending data via Inertia form using POST method (with _method=PUT/PATCH for file upload support)
        // Laravel reads file uploads properly.
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'is_featured' => 'boolean',
            'status' => 'required|in:pending,approved,rejected',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'customer_avatar' => 'nullable|string',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('testimonials', 'public');
            $validated['customer_avatar'] = Storage::disk('public')->url($path);
        }

        unset($validated['avatar']);

        $oldValue = $testimonial->toArray();
        $testimonial->update($validated);

        ActivityLogger::log('UPDATE', 'testimonials', "Updated testimonial for customer '{$testimonial->customer_name}'", $oldValue, $testimonial->toArray());

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    public function updateStatus(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'is_featured' => 'boolean'
        ]);

        $oldValue = $testimonial->toArray();
        $testimonial->update($validated);

        ActivityLogger::log('UPDATE', 'testimonials', "Updated status for review of customer '{$testimonial->customer_name}' to '{$testimonial->status}'", $oldValue, $testimonial->toArray());

        return redirect()->back()->with('success', 'Review status updated successfully.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $oldValue = $testimonial->toArray();
        $testimonial->delete();

        ActivityLogger::log('DELETE', 'testimonials', "Deleted testimonial of customer '{$oldValue['customer_name']}'", $oldValue, null);

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}
