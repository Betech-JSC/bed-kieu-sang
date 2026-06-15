<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_code', 'like', '%' . $search . '%')
                  ->orWhere('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('customer_phone', 'like', '%' . $search . '%')
                  ->orWhere('customer_email', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items.product');
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
            'payment_status' => 'required|in:pending,paid,failed',
        ]);

        $oldValue = $order->toArray();
        $order->update($validated);

        ActivityLogger::log('UPDATE', 'orders', "Updated order '{$order->order_code}' (Status: {$order->status}, Payment: {$order->payment_status})", $oldValue, $order->toArray());

        return redirect()->route('admin.orders.show', $order->id)->with('success', 'Order updated successfully.');
    }
}
