<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\Order;
use App\Models\Contact;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'products_count' => Product::count(),
            'blogs_count' => BlogPost::count(),
            'orders_count' => Order::count(),
            'contacts_count' => Contact::count(),
            'recent_orders' => Order::latest()->take(5)->get(),
        ];

        return Inertia::render('Dashboard', ['stats' => $stats]);
    }
}
