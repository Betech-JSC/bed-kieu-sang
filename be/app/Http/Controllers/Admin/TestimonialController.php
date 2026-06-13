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
    public function index(): Response
    {
        $testimonials = Testimonial::with('product')->latest()->paginate(15);
        return Inertia::render('Reviews/Index', ['testimonials' => $testimonials]);
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
