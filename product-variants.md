# Product Variants

## Goal
Cho phép một sản phẩm có danh sách phân loại kiểu Shopee, mỗi phân loại định giá riêng, quản trị trong CMS và mua đúng phân loại trên web.

## Tasks
- [x] Tạo schema/model cho phân loại sản phẩm và snapshot phân loại trong đơn hàng → Verify: migrate và relationship tests chạy đúng.
- [x] Mở rộng Product CMS controller để validate, lưu và cập nhật toàn bộ cấu hình biến thể trong transaction → Verify: feature tests CRUD biến thể.
- [x] Bổ sung trình cấu hình phân loại trực tiếp trong form CMS → Verify: CMS build thành công và payload khớp validation.
- [x] Trả phân loại đang bán trong public product API và dùng giá thấp nhất trên danh sách → Verify: API feature tests kiểm tra response.
- [x] Tích hợp chọn phân loại, giá/ảnh/tồn kho vào trang chi tiết và giỏ hàng web → Verify: Next.js lint/build.
- [x] Gửi variant_id khi checkout, khóa giá phía server và lưu snapshot vào order item/CMS order detail → Verify: order API tests gồm hết hàng và dữ liệu giả mạo.
- [x] Chạy backend tests, CMS build, web lint/typecheck/build và rà diff → Verify: các kiểm tra phạm vi tính năng hoàn tất không lỗi.

## Done When
- [x] Sản phẩm cũ không có phân loại vẫn hoạt động như trước.
- [x] Sản phẩm có phân loại bắt buộc chọn một phân loại trước khi thêm giỏ hàng.
- [x] Giá, SKU và tên phân loại trong đơn hàng lấy từ server, không tin dữ liệu phía trình duyệt.

## Notes
Mỗi phân loại là một dòng cấu hình độc lập; order item giữ snapshot để lịch sử không đổi khi CMS sửa phân loại.
