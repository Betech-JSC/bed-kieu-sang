# Replace Product Seeder

## Goal
Thay toàn bộ danh sách sản phẩm mẫu bằng 11 sản phẩm tẩy uế trong ảnh, mỗi sản phẩm có 4 phân loại giá 100.000đ và không tạo giao dịch mẫu.

## Tasks
- [x] Tách danh sách 11 sản phẩm sang ProductCatalogSeeder với ảnh để trống → Verify: fresh seed tạo đúng 11 sản phẩm.
- [x] Đổi ProductVariantSeeder sang 4 phân loại chung, giá 100.000đ → Verify: tạo đúng 44 phân loại.
- [x] Loại bỏ các block sản phẩm cũ, đơn hàng và order item khỏi DatabaseSeeder → Verify: không còn tham chiếu slug cũ hoặc Order::create.
- [x] Thêm fallback ảnh an toàn trên web khi image_path rỗng → Verify: TypeScript và production build thành công.
- [x] Chạy migrate:fresh --seed trên SQLite và kiểm tra số lượng/bảng giao dịch → Verify: products=11, variants=44, orders=0, order_items=0.

## Done When
- [x] Deploy database mới chỉ seed danh mục sản phẩm mới và không có giao dịch mẫu.
- [x] Mọi sản phẩm/phân loại có giá 100.000đ.
