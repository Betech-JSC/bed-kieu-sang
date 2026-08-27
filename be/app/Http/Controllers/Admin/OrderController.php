<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
        $order->load(['items.product', 'items.variant']);
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

    public function export(Request $request): StreamedResponse
    {
        $query = Order::with('items')->latest();

        if ($request->filled('month')) {
            $parts = explode('-', $request->month);
            if (count($parts) === 2) {
                $query->whereYear('created_at', $parts[0])
                      ->whereMonth('created_at', $parts[1]);
            }
        }

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

        $orders = $query->get();

        $monthStr = $request->filled('month') ? $request->month : date('Y-m');
        $fileName = 'Bao_cao_don_hang_T' . date('m_Y', strtotime($monthStr . '-01')) . '.csv';

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            
            // UTF-8 BOM for Excel compatibility with Vietnamese
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Header row
            fputcsv($handle, [
                'STT',
                'Mã đơn hàng',
                'Ngày đặt hàng',
                'Tên khách hàng',
                'Số điện thoại',
                'Email',
                'Địa chỉ giao hàng',
                'Tên sản phẩm',
                'Số lượng',
                'Đơn giá (VNĐ)',
                'Thành tiền món (VNĐ)',
                'Tổng tiền đơn (VNĐ)',
                'Hình thức thanh toán',
                'Trạng thái thanh toán',
                'Trạng thái đơn hàng',
                'Ghi chú'
            ]);

            $stt = 1;
            foreach ($orders as $order) {
                $paymentStatusText = match($order->payment_status) {
                    'paid' => 'Đã thanh toán',
                    'pending' => 'Chờ thanh toán',
                    'failed' => 'Thanh toán thất bại',
                    default => (string)$order->payment_status
                };

                $orderStatusText = match($order->status) {
                    'completed' => 'Hoàn thành',
                    'processing' => 'Đang xử lý',
                    'pending' => 'Chờ xử lý',
                    'cancelled' => 'Đã huỷ',
                    default => (string)$order->status
                };

                $paymentMethodText = $order->payment_method === 'cod' ? 'COD' : ($order->payment_method === 'bank_transfer' ? 'Chuyển khoản QR' : $order->payment_method);

                if ($order->items->isEmpty()) {
                    fputcsv($handle, [
                        $stt++,
                        $order->order_code,
                        $order->created_at ? $order->created_at->format('d/m/Y H:i') : '',
                        $order->customer_name,
                        $order->customer_phone,
                        $order->customer_email ?? '',
                        $order->shipping_address,
                        'N/A',
                        0,
                        0,
                        0,
                        $order->total_amount,
                        $paymentMethodText,
                        $paymentStatusText,
                        $orderStatusText,
                        $order->notes ?? ''
                    ]);
                } else {
                    foreach ($order->items as $item) {
                        $itemTotal = (float)$item->price * (int)$item->quantity;
                        fputcsv($handle, [
                            $stt++,
                            $order->order_code,
                            $order->created_at ? $order->created_at->format('d/m/Y H:i') : '',
                            $order->customer_name,
                            $order->customer_phone,
                            $order->customer_email ?? '',
                            $order->shipping_address,
                            $item->product_name,
                            $item->quantity,
                            $item->price,
                            $itemTotal,
                            $order->total_amount,
                            $paymentMethodText,
                            $paymentStatusText,
                            $orderStatusText,
                            $order->notes ?? ''
                        ]);
                    }
                }
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
