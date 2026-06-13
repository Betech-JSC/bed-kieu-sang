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
    public function index(): Response
    {
        $orders = Order::latest()->paginate(15);
        return Inertia::render('Orders/Index', ['orders' => $orders]);
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
