# 🌿 Thảo Mộc Kiều Sang - Website Cửa Hàng Thảo Mộc Thiên Nhiên

Chào mừng đến với dự án website thương mại điện tử của **Thảo Mộc Kiều Sang** — Thương hiệu thảo mộc thiên nhiên cao cấp giúp thanh lọc không gian sống, chăm sóc sức khỏe tinh thần và khơi thông vượng khí an lành.

Dự án được xây dựng và thiết kế theo ngôn ngữ thiết kế **Organic Zen** hiện đại, chú trọng đến sự tối giản, tinh tế và trải nghiệm người dùng mượt mà trên mọi thiết bị.

---

## 🎨 Ngôn Ngữ Thiết Kế (Organic Zen Style)
*   **Tone màu chủ đạo**: Sự kết hợp hài hòa giữa màu kem ấm áp (`#FAF6EE`/`#FFFDF9`), sắc xanh lá rừng thẳm (`#043616`) làm điểm nhấn thương hiệu và sắc vàng hoàng kim (`#E5C44B`) cho các yếu tố nổi bật.
*   **Hình học & Bố cục**: Các góc bo tròn mềm mại (`rounded-[32px]`), khoảng trắng thoáng đãng, các đường viền siêu mảnh, họa tiết Feng Shui phương Đông tinh tế (`asian-pattern`) cùng hiệu ứng chiều sâu cao cấp.
*   **Hiệu ứng động**: Tích hợp các hạt hơi nước bay nhẹ (`steam-particle`), hiệu ứng di chuột mượt mà (`hover:scale-103 hover:-translate-y-1`) và tối ưu hóa hiệu năng cuộn trang 60fps bằng `requestAnimationFrame`.

---

## ✨ Tính Năng Nổi Bật
1.  **Trang Chủ Trực Quan ([page.tsx](src/app/page.tsx))**:
    *   Hero Banner tỉ lệ **2:1** với hình nền phong cảnh thiên nhiên hòa hợp cùng hình ảnh sản phẩm tách nền nổi bật, hỗ trợ hiển thị đẹp mắt trên cả Mobile.
    *   Khối giá trị "Năng Lượng Chữa Lành" được thiết kế tối giản, loại bỏ đường viền rườm rà.
    *   Mục Blog và Nhận xét khách hàng được tối ưu hóa cân đối về mặt thị giác.
2.  **Cửa Hàng & Danh Mục Sản Phẩm ([products/page.tsx](src/app/products/page.tsx))**:
    *   Sidebar lọc danh mục tiện lợi tích hợp thanh tìm kiếm và bộ lọc sắp xếp giá bán.
    *   Bộ lọc hoạt động dựa trên URL Parameter (`/products?category=...`), giúp đường link có thể dễ dàng chia sẻ, lưu dấu trang (bookmark) và hỗ trợ SEO tốt nhất.
3.  **Trang Chi Tiết Sản Phẩm ([products/[id]/page.tsx](src/app/products/[id]/page.tsx))**:
    *   Hiển thị thông tin chi tiết, hình ảnh thư viện slide, thông số kích thước, đặc tính và các chứng nhận chất lượng (100% tự nhiên, lành tính).
    *   Đề xuất các sản phẩm liên quan cùng danh mục phía dưới.
4.  **Đồng Bộ Giỏ Hàng Động (Cart Drawer)**:
    *   Sử dụng cơ chế Custom Window Event (`kieu-sang-cart-update`) để đồng bộ giỏ hàng và số lượng trên Badge Header ngay lập tức giữa tất cả các trang Next.js mà không cần dùng đến Context Provider phức tạp.
5.  **Góc An Yên / Blog Tin Tức ([blog/page.tsx](src/app/blog/page.tsx))**:
    *   Chia sẻ các bí quyết xông nhà, liệu pháp hương thơm giảm stress. Trang chi tiết bài viết thiết kế tinh giản, tối ưu cỡ chữ thân thiện với người đọc.
6.  **Trang Giới Thiệu & Liên Hệ**:
    *   [about/page.tsx](src/app/about/page.tsx) kể về hành trình và cam kết thảo mộc sạch.
    *   [contact/page.tsx](src/app/contact/page.tsx) cung cấp form gửi thông tin liên hệ gọn gàng và trực quan.

---

## 🛠️ Công Nghệ Sử Dụng
*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Thư viện UI:** [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Component Foundation:** [@base-ui/react](https://base-ui.com/)
*   **Tối ưu hóa hình ảnh:** Component `<Image />` mặc định từ Next.js hỗ trợ nén WebP/AVIF và Lazy Loading tự động.

---

## ⚡ Hướng Dẫn Chạy Dự Án (Local Development)

### 1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

### 2. Khởi chạy máy chủ phát triển nội bộ:
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.

### 3. Tạo bản build tối ưu hóa sản xuất:
```bash
npm run build
```

### 4. Triển khai Docker:
Dự án đã tích hợp sẵn [Dockerfile](Dockerfile) để bạn dễ dàng đóng gói Container và triển khai lên các dịch vụ VPS/CapRover.

---

## 📄 Bản Quyền
Dự án được phát triển và sở hữu bởi **Thảo Mộc Kiều Sang** và **Betech JSC**.
Lưu hành nội bộ và bảo mật thông tin mã nguồn.
