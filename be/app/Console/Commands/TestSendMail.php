<?php

namespace App\Console\Commands;

use App\Mail\NewOrderAdminNotification;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestSendMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email? : Địa chỉ email người nhận (mặc định lấy theo ADMIN_MAIL)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kiểm tra cấu hình SMTP và gửi thử email thông báo đơn hàng mới';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $recipient = $this->argument('email') ?: config('mail.admin_email', env('ADMIN_MAIL', 'nhatbao2850@gmail.com'));

        $this->info('==================================================');
        $this->info('🚀 KIỂM TRA CẤU HÌNH GỬI MAIL THỬ NGHIỆM (SMTP)');
        $this->info('==================================================');

        $driver = config('mail.default');
        $host = config('mail.mailers.smtp.host');
        $port = config('mail.mailers.smtp.port');
        $encryption = config('mail.mailers.smtp.encryption');
        $username = config('mail.mailers.smtp.username');
        $password = config('mail.mailers.smtp.password');
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');

        $this->table(
            ['Cấu hình', 'Giá trị'],
            [
                ['Mailer Driver', $driver],
                ['SMTP Host', $host],
                ['SMTP Port', $port],
                ['Encryption', $encryption ?? 'null'],
                ['Username', $username ?? 'chưa cấu hình'],
                ['Password', empty($password) ? '<RỖNG>' : ($password === 'dien_mat_khau_ung_dung_tai_day' ? '<CHƯA ĐIỀN MẬT KHẨU THẬT>' : '******** (Đã điền)')],
                ['From Address', $fromAddress],
                ['From Name', $fromName],
                ['Người nhận thử nghiệm', $recipient],
            ]
        );

        if ($password === 'dien_mat_khau_ung_dung_tai_day' || empty($password)) {
            $this->warn("\n⚠️  CẢNH BÁO: MAIL_PASSWORD đang là giá trị mặc định hoặc trống!");
            $this->line("👉 Bạn cần tạo 'Mật khẩu ứng dụng' (App Password 16 ký tự) từ tài khoản Gmail và điền vào be/.env");
        }

        $this->info("\n⏳ Đang chuẩn bị dữ liệu mẫu và kết nối gửi email đến: {$recipient}...");

        // Chuẩn bị đơn hàng mẫu để test template
        $order = null;
        try {
            $order = Order::with(['items.productVariant', 'items.product'])->latest('id')->first();
        } catch (\Throwable $e) {
            // Nếu không kết nối được database, tự động chuyển sang đơn hàng mẫu
        }

        if (!$order) {
            $order = new Order([
                'order_code' => 'KS-TESTDEMO',
                'customer_name' => 'Khách Hàng Thử Nghiệm',
                'customer_email' => 'khachhang@example.com',
                'customer_phone' => '0987654321',
                'shipping_address' => 'Số 123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
                'notes' => 'Giao hàng giờ hành chính. Đây là email test hệ thống tự động.',
                'total_amount' => 12500000,
                'payment_method' => 'cod',
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);
            $order->id = 1;
            $order->created_at = now();

            $item1 = new OrderItem([
                'product_name' => 'Giường ngủ thông minh kiểu Nhật KS-01',
                'variant_name' => 'Gỗ Sồi Tự Nhiên (1m8 x 2m)',
                'variant_sku' => 'KS-01-OAK-18',
                'price' => 12500000,
                'quantity' => 1,
            ]);

            $order->setRelation('items', collect([$item1]));
        }

        try {
            Mail::to($recipient)->send(new NewOrderAdminNotification($order));

            $this->newLine();
            $this->info('==================================================');
            $this->info("✅ THÀNH CÔNG: Email thông báo đã được gửi tới {$recipient}!");
            $this->info('👉 Vui lòng kiểm tra Hộp thư đến (Inbox) hoặc Thư rác/Spam của Gmail.');
            $this->info('==================================================');

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->newLine();
            $this->error('==================================================');
            $this->error('❌ GỬI MAIL THẤT BẠI!');
            $this->error('Chi tiết lỗi: ' . $e->getMessage());
            $this->error('==================================================');

            $this->warn("\n💡 HƯỚNG DẪN KHẮC PHỤC DÀNH CHO GMAIL SMTP:");
            $this->line("1. Mở trang Quản lý tài khoản Google: https://myaccount.google.com/security");
            $this->line("2. Đảm bảo đã bật 'Xác minh 2 bước' (2-Step Verification).");
            $this->line("3. Tìm kiếm mục 'Mật khẩu ứng dụng' (App Passwords) hoặc truy cập: https://myaccount.google.com/apppasswords");
            $this->line("4. Tạo một mật khẩu ứng dụng mới (đặt tên ví dụ: 'KieuSang Website').");
            $this->line("5. Sao chép mật khẩu 16 ký tự vừa tạo (bỏ khoảng trắng).");
            $this->line("6. Mở file `be/.env` và cập nhật dòng: `MAIL_PASSWORD=chuoi16kytuvualay`");
            $this->line("7. Chạy lại lệnh: `php artisan mail:test` để kiểm tra.");

            return Command::FAILURE;
        }
    }
}
