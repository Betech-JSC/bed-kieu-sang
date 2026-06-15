<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

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
}
