# Kế hoạch Triển khai các Phân hệ CMS B2B còn thiếu cho Sophpower

## Overview
Dự án nhằm triển khai và hoàn thiện các module quản trị nội dung (CMS) B2B còn thiếu trong hệ thống admin của Sophpower Vietnam để giúp Ban quản trị có thể thay đổi dữ liệu động một cách linh hoạt mà không cần can thiệp trực tiếp vào mã nguồn.

## Project Type
- **WEB** (Laravel 11+ / Inertia.js / Vue 3 / Vite)

## Success Criteria
- Tạo đầy đủ các bảng dữ liệu qua Laravel Migrations.
- Xây dựng Controllers xử lý đầy đủ các tính năng CRUD.
- Phát triển giao diện Admin Dashboard (Inertia views) tương ứng cho từng module tại thư mục `be/resources/js/Pages`.
- Tích hợp Middleware chuyển hướng SEO Redirects.
- Lưu nhật ký hoạt động hệ thống (Activity Logs) cho mọi hành động thêm/sửa/xóa của admin.
- Biên dịch thành công các assets thông qua `npm run build` của Laravel/Vite.

## Tech Stack
- **Backend Framework**: Laravel 11+
- **Frontend Framework trong Admin**: Inertia.js (Vue 3)
- **Styling**: Tailwind CSS
- **Database**: MySQL

## File Structure

```plaintext
be/
├── app/
│   ├── Helpers/
│   │   └── ActivityLogger.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Admin/
│   │   │       ├── PageController.php
│   │   │       ├── BannerController.php
│   │   │       ├── FaqController.php
│   │   │       ├── SettingController.php
│   │   │       ├── SeoRedirectController.php
│   │   │       ├── ProductQuestionController.php
│   │   │       └── ActivityLogController.php
│   │   └── Middleware/
│   │       └── HandleSeoRedirects.php
│   └── Models/
│       ├── Page.php
│       ├── Banner.php
│       ├── Faq.php
│       ├── Setting.php
│       ├── SeoRedirect.php
│       ├── ProductQuestion.php
│       └── ActivityLog.php
├── database/
│   └── migrations/
│       ├── 2026_06_13_000001_create_pages_table.php
│       ├── 2026_06_13_000002_create_banners_table.php
│       ├── 2026_06_13_000003_create_faqs_table.php
│       ├── 2026_06_13_000004_create_settings_table.php
│       ├── 2026_06_13_000005_create_seo_redirects_table.php
│       ├── 2026_06_13_000006_create_product_questions_table.php
│       └── 2026_06_13_000007_create_activity_logs_table.php
└── resources/
    └── js/
        ├── Layouts/
        │   └── CrmLayout.vue (Cập nhật Menu Sidebar)
        └── Pages/
            ├── Pages/
            │   ├── Index.vue
            │   └── Form.vue
            ├── Banners/
            │   ├── Index.vue
            │   └── Form.vue
            ├── Faqs/
            │   ├── Index.vue
            │   └── Form.vue
            ├── Settings/
            │   └── Index.vue
            ├── SeoRedirects/
            │   ├── Index.vue
            │   └── Form.vue
            ├── ProductQuestions/
            │   └── Index.vue
            └── ActivityLogs/
                └── Index.vue
```

---

## Task Breakdown

### Phase 1: Database & Model Setup (P0 - Foundation)
- [x] **Task 1.1: Tạo Migrations**
  - **Agent**: `database-architect`
  - **Skills**: `database-design`
  - **Input**: Danh sách các bảng dữ liệu
  - **Output**: 7 tệp migrations trong `database/migrations`
  - **Verify**: `php artisan migrate` chạy thành công không có lỗi.
  
- [x] **Task 1.2: Tạo Models**
  - **Agent**: `database-architect`
  - **Skills**: `database-design`
  - **Input**: Schema các bảng dữ liệu
  - **Output**: Các file model trong `app/Models/` định nghĩa đúng casting cho các cột JSON.
  - **Verify**: Kiểm tra cú pháp các file model không có lỗi.

### Phase 2: Business Logic & Routing (P1 - Core Backend)
- [x] **Task 2.1: Tạo ActivityLogger Helper**
  - **Agent**: `backend-specialist`
  - **Skills**: `nodejs-best-practices`
  - **Input**: Yêu cầu ghi log
  - **Output**: Helper `app/Helpers/ActivityLogger.php`
  - **Verify**: Log được ghi nhận chính xác vào DB.

- [x] **Task 2.2: Tạo Middleware HandleSeoRedirects**
  - **Agent**: `backend-specialist`
  - **Skills**: `nodejs-best-practices`
  - **Input**: Router & Request lifecycle
  - **Output**: Middleware `HandleSeoRedirects.php`
  - **Verify**: Đăng ký middleware trong bootstrap/app.php thành công.

- [x] **Task 2.3: Tạo các Controllers**
  - **Agent**: `backend-specialist`
  - **Skills**: `api-patterns`
  - **Input**: Models & routes
  - **Output**: 7 controller trong `app/Http/Controllers/Admin/` xử lý CRUD và log hoạt động thông qua ActivityLogger.
  - **Verify**: Các controller gọi đúng và truyền dữ liệu cho views thông qua Inertia.

- [x] **Task 2.4: Đăng ký Routes**
  - **Agent**: `backend-specialist`
  - **Skills**: `api-patterns`
  - **Input**: Controllers
  - **Output**: Cập nhật file `routes/web.php` và `bootstrap/app.php`.
  - **Verify**: `php artisan route:list` hiển thị đầy đủ các routes mới đăng ký.

### Phase 3: Frontend Views & Navigation (P2 - Web UI)
- [x] **Task 3.1: Cập nhật Sidebar trong CrmLayout.vue**
  - **Agent**: `frontend-specialist`
  - **Skills**: `frontend-design`
  - **Input**: CrmLayout.vue
  - **Output**: Cập nhật danh sách menu động liên kết tới các route mới.
  - **Verify**: Sidebar trong Admin hiển thị đúng các mục menu mới.

- [x] **Task 3.2: Tạo giao diện các Views Vue 3**
  - **Agent**: `frontend-specialist`
  - **Skills**: `frontend-design`
  - **Input**: Inertia views template
  - **Output**: Các file view `.vue` trong thư mục tương ứng trong `resources/js/Pages/`.
  - **Verify**: Biên dịch thành công thông qua `npm run build` trong `be/`.

---

## Phase X: Verification

- [x] Chạy lệnh `npm run build` trong thư mục `be/` để build assets thành công.
- [x] Chạy lệnh `php artisan migrate` không lỗi.
- [x] Kiểm tra thủ công tính năng chuyển hướng URL (Redirects).
- [x] Kiểm tra ghi nhật ký hoạt động (System Logs).
- [x] Tuân thủ tuyệt đối quy định "Purple Ban" (không dùng màu tím).

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-06-13
