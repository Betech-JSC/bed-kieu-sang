<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PublicOrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_code' => 'nullable|string|max:50',
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'nullable|email|max:100',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer|exists:products,id',
            'items.*.product_slug' => 'nullable|string|exists:products,slug',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        foreach ($validated['items'] as $index => $item) {
            if (empty($item['product_id']) && empty($item['product_slug'])) {
                throw ValidationException::withMessages([
                    "items.$index.product_id" => 'Each order item must include product_id or product_slug.',
                ]);
            }
        }

        return DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            $itemsData = [];

            // Calculate totals and fetch product info
            foreach ($validated['items'] as $item) {
                $product = Product::query()
                    ->when(!empty($item['product_id']), fn ($query) => $query->whereKey($item['product_id']))
                    ->when(empty($item['product_id']) && !empty($item['product_slug']), fn ($query) => $query->where('slug', $item['product_slug']))
                    ->firstOrFail();
                if ($product->status !== 'active') {
                    throw ValidationException::withMessages(['items' => "Sản phẩm {$product->name} hiện không còn được bán."]);
                }

                $variant = null;
                $hasVariants = $product->variants()->exists();
                if ($hasVariants && empty($item['variant_id'])) {
                    throw ValidationException::withMessages(['items' => "Vui lòng chọn phân loại cho sản phẩm {$product->name}."]);
                }

                if (!empty($item['variant_id'])) {
                    $variant = ProductVariant::query()
                        ->whereKey($item['variant_id'])
                        ->lockForUpdate()
                        ->firstOrFail();
                    if ($variant->product_id !== $product->id || $variant->status !== 'active') {
                        throw ValidationException::withMessages(['items' => "Phân loại của {$product->name} không hợp lệ."]);
                    }
                    if ($variant->stock < $item['quantity']) {
                        throw ValidationException::withMessages(['items' => "Phân loại {$variant->name} chỉ còn {$variant->stock} sản phẩm."]);
                    }
                }

                $unitPrice = $variant?->price ?? $product->price;
                $itemTotal = $unitPrice * $item['quantity'];
                $totalAmount += $itemTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'variant_name' => $variant?->name,
                    'variant_sku' => $variant?->sku,
                    'price' => $unitPrice,
                    'quantity' => $item['quantity'],
                ];

                if ($variant) {
                    $variant->decrement('stock', $item['quantity']);
                }
            }

            // Create Order
            $orderCode = $validated['order_code'] ?? null;
            if (empty($orderCode) || Order::where('order_code', $orderCode)->exists()) {
                $orderCode = 'KS-' . strtoupper(Str::random(8));
                while (Order::where('order_code', $orderCode)->exists()) {
                    $orderCode = 'KS-' . strtoupper(Str::random(8));
                }
            }

            $order = Order::create([
                'order_code' => $orderCode,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);

            // Create Order Items
            foreach ($itemsData as $itemData) {
                $order->items()->create($itemData);
                Product::whereKey($itemData['product_id'])->increment('real_sales', $itemData['quantity']);
            }

            return response()->json([
                'success' => true,
                'order_code' => $order->order_code,
                'total_amount' => $order->total_amount,
                'message' => 'Order placed successfully.'
            ], 201);
        });
    }

    public function show(string $orderCode): JsonResponse
    {
        $order = Order::with('items')
            ->where('order_code', $orderCode)
            ->firstOrFail();

        return response()->json($order);
    }
}
