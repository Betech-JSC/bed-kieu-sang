<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[ĐƠN HÀNG MỚI] Mã đơn {{ $order->order_code }} - Khách hàng: {{ $order->customer_name }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            -webkit-text-size-adjust: 100%;
        }
        .container {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 24px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #f59e0b;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            color: #cbd5e1;
        }
        .badge {
            display: inline-block;
            background-color: #ef4444;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            padding: 4px 10px;
            border-radius: 9999px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .content {
            padding: 24px;
        }
        .section-title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            border-left: 4px solid #f59e0b;
            padding-left: 10px;
            margin: 20px 0 12px 0;
            text-transform: uppercase;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f8fafc;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 16px;
        }
        .info-table td {
            padding: 10px 14px;
            font-size: 14px;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-table td.label {
            font-weight: 600;
            color: #64748b;
            width: 140px;
        }
        .info-table td.value {
            color: #0f172a;
            font-weight: 500;
        }
        .phone-link {
            display: inline-block;
            color: #0284c7;
            font-weight: 700;
            text-decoration: none;
            background-color: #e0f2fe;
            padding: 2px 8px;
            border-radius: 4px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 16px;
        }
        .items-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-size: 13px;
            font-weight: 600;
            text-align: left;
            padding: 10px 12px;
            border-bottom: 2px solid #cbd5e1;
        }
        .items-table td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
            vertical-align: middle;
        }
        .items-table .text-center {
            text-align: center;
        }
        .items-table .text-right {
            text-align: right;
        }
        .variant-badge {
            display: inline-block;
            background-color: #fef3c7;
            color: #92400e;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 2px;
        }
        .total-box {
            background-color: #fefce8;
            border: 1px solid #fef08a;
            border-radius: 6px;
            padding: 16px;
            margin-top: 16px;
            margin-bottom: 24px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }
        .total-amount {
            color: #dc2626;
            font-size: 20px;
        }
        .cta-container {
            text-align: center;
            margin: 28px 0 16px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #b45309;
            color: #ffffff !important;
            font-size: 15px;
            font-weight: bold;
            padding: 12px 28px;
            text-decoration: none;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(180, 83, 9, 0.3);
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 16px 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="badge">🔔 Đơn Hàng Mới</div>
            <h1>Nội Thất Kiểu Sáng</h1>
            <p>Hệ thống vừa ghi nhận đơn hàng mới từ khách hàng</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Thông tin đơn hàng tóm tắt -->
            <table style="width: 100%; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                <tr>
                    <td style="font-size: 14px; color: #64748b;">
                        Mã đơn hàng: <strong style="font-size: 16px; color: #b45309;">{{ $order->order_code }}</strong>
                    </td>
                    <td style="font-size: 14px; color: #64748b; text-align: right;">
                        Thời gian: <strong>{{ $order->created_at ? $order->created_at->setTimezone('Asia/Ho_Chi_Minh')->format('H:i:s - d/m/Y') : now()->setTimezone('Asia/Ho_Chi_Minh')->format('H:i:s - d/m/Y') }}</strong>
                    </td>
                </tr>
            </table>

            <!-- Thông tin khách hàng -->
            <div class="section-title">Thông tin khách hàng</div>
            <table class="info-table">
                <tr>
                    <td class="label">Họ và tên:</td>
                    <td class="value">{{ $order->customer_name }}</td>
                </tr>
                <tr>
                    <td class="label">Số điện thoại:</td>
                    <td class="value">
                        <a href="tel:{{ $order->customer_phone }}" class="phone-link">
                            📞 {{ $order->customer_phone }} (Bấm để gọi ngay)
                        </a>
                    </td>
                </tr>
                @if(!empty($order->customer_email))
                <tr>
                    <td class="label">Email:</td>
                    <td class="value">
                        <a href="mailto:{{ $order->customer_email }}" style="color: #0284c7; text-decoration: none;">
                            {{ $order->customer_email }}
                        </a>
                    </td>
                </tr>
                @endif
                <tr>
                    <td class="label">Địa chỉ giao hàng:</td>
                    <td class="value">{{ $order->shipping_address }}</td>
                </tr>
                <tr>
                    <td class="label">Ghi chú đơn hàng:</td>
                    <td class="value" style="color: {{ !empty($order->notes) ? '#b45309' : '#94a3b8' }}; font-style: {{ !empty($order->notes) ? 'normal' : 'italic' }};">
                        {{ !empty($order->notes) ? $order->notes : 'Không có ghi chú' }}
                    </td>
                </tr>
            </table>

            <!-- Danh sách sản phẩm -->
            <div class="section-title">Chi tiết sản phẩm đã đặt</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 45%;">Sản phẩm / Mẫu</th>
                        <th style="width: 20%;">Phân loại</th>
                        <th class="text-center" style="width: 10%;">SL</th>
                        <th class="text-right" style="width: 12%;">Đơn giá</th>
                        <th class="text-right" style="width: 13%;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->product_name }}</strong>
                            @if(!empty($item->variant_sku))
                                <div style="font-size: 11px; color: #94a3b8;">SKU: {{ $item->variant_sku }}</div>
                            @endif
                        </td>
                        <td>
                            @php
                                $variantTitle = $item->variant_name ?: ($item->productVariant?->name ?: ($item->variant?->name ?: null));
                            @endphp
                            @if($variantTitle)
                                <span class="variant-badge">{{ $variantTitle }}</span>
                            @else
                                <span style="color: #94a3b8; font-size: 12px;">Tiêu chuẩn</span>
                            @endif
                        </td>
                        <td class="text-center" style="font-weight: 600;">
                            {{ $item->quantity }}
                        </td>
                        <td class="text-right" style="white-space: nowrap;">
                            {{ number_format($item->price, 0, ',', '.') }} đ
                        </td>
                        <td class="text-right" style="font-weight: 600; color: #0f172a; white-space: nowrap;">
                            {{ number_format($item->price * $item->quantity, 0, ',', '.') }} đ
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Thanh toán & Tổng tiền -->
            <div class="total-box">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="font-size: 14px; color: #475569; padding-bottom: 8px;">Phương thức thanh toán:</td>
                        <td style="font-size: 14px; font-weight: 600; text-align: right; color: #0f172a; padding-bottom: 8px;">
                            @php
                                $method = strtolower($order->payment_method);
                            @endphp
                            @if(str_contains($method, 'pay2s') || str_contains($method, 'bank') || str_contains($method, 'vietqr') || str_contains($method, 'transfer'))
                                💳 Chuyển khoản VietQR / Ngân hàng
                            @elseif($method === 'cod')
                                📦 Thanh toán khi nhận hàng (COD)
                            @else
                                {{ strtoupper($order->payment_method) }}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #475569; padding-bottom: 8px;">Trạng thái thanh toán:</td>
                        <td style="font-size: 14px; font-weight: 600; text-align: right; color: {{ $order->payment_status === 'paid' ? '#16a34a' : '#d97706' }}; padding-bottom: 8px;">
                            {{ $order->payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán' }}
                        </td>
                    </tr>
                    <tr style="border-top: 1px dashed #cbd5e1;">
                        <td style="font-size: 16px; font-weight: bold; color: #0f172a; padding-top: 10px;">Tổng tiền đơn hàng:</td>
                        <td style="font-size: 20px; font-weight: bold; text-align: right; color: #dc2626; padding-top: 10px;">
                            {{ number_format($order->total_amount, 0, ',', '.') }} đ
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Nút truy cập Admin -->
            @if(!empty($adminUrl))
            <div class="cta-container">
                <a href="{{ $adminUrl }}" target="_blank" class="cta-button">
                    👉 Xem &amp; Xử Lý Đơn Hàng Tại Admin
                </a>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
                    (Đăng nhập quản trị viên để cập nhật trạng thái đơn hàng)
                </p>
            </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 4px 0;">Email thông báo tự động từ hệ thống website <strong>Nội Thất Kiểu Sáng</strong>.</p>
            <p style="margin: 0;">Vui lòng liên hệ lại với khách hàng sớm nhất để xác nhận và điều phối vận chuyển.</p>
        </div>
    </div>
</body>
</html>
