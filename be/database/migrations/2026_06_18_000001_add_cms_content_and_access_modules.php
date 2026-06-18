<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->unsignedInteger('sort_order')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->index(['status', 'sort_order']);
        });

        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->text('question');
            $table->text('answer')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('answered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();
            $table->index(['product_id', 'status', 'created_at']);
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('disk')->default('public');
            $table->string('path')->unique();
            $table->string('original_name');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->string('alt_text')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['mime_type', 'created_at']);
        });

        Schema::table('banners', function (Blueprint $table) {
            $table->string('page_key', 50)->default('home')->after('link_url');
            $table->string('position', 50)->default('hero')->after('page_key');
            $table->index(['page_key', 'position', 'status', 'order_index'], 'banners_placement_index');
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('module', 50);
            $table->timestamps();
            $table->index('module');
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('role')->constrained()->nullOnDelete();
        });

        $permissionGroups = [
            'products' => ['view_products' => 'Xem sản phẩm', 'manage_products' => 'Quản lý sản phẩm'],
            'categories' => ['view_categories' => 'Xem danh mục', 'manage_categories' => 'Quản lý danh mục'],
            'blogs' => ['view_blogs' => 'Xem bài viết', 'manage_blogs' => 'Quản lý bài viết'],
            'pages' => ['view_pages' => 'Xem trang tĩnh', 'manage_pages' => 'Quản lý trang tĩnh'],
            'banners' => ['view_banners' => 'Xem banner', 'manage_banners' => 'Quản lý banner'],
            'faqs' => ['view_faqs' => 'Xem FAQ', 'manage_faqs' => 'Quản lý FAQ'],
            'product_questions' => ['view_product_questions' => 'Xem hỏi đáp sản phẩm', 'manage_product_questions' => 'Quản lý hỏi đáp sản phẩm'],
            'media' => ['view_media' => 'Xem thư viện media', 'manage_media' => 'Quản lý thư viện media'],
            'orders' => ['view_orders' => 'Xem đơn hàng', 'manage_orders' => 'Quản lý đơn hàng'],
            'contacts' => ['view_contacts' => 'Xem liên hệ', 'manage_contacts' => 'Quản lý liên hệ'],
            'reviews' => ['view_reviews' => 'Xem đánh giá', 'manage_reviews' => 'Quản lý đánh giá'],
            'settings' => ['view_settings' => 'Xem cấu hình', 'manage_settings' => 'Cấu hình hệ thống'],
            'users' => ['view_users' => 'Xem người dùng', 'manage_users' => 'Quản lý người dùng'],
            'roles' => ['view_roles' => 'Xem vai trò', 'manage_roles' => 'Quản lý vai trò và phân quyền'],
            'activity_logs' => ['view_activity_logs' => 'Xem nhật ký hệ thống'],
        ];

        foreach ($permissionGroups as $module => $permissions) {
            foreach ($permissions as $key => $name) {
                DB::table('permissions')->insert([
                    'key' => $key,
                    'name' => $name,
                    'module' => $module,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $roles = [
            'super_admin' => ['name' => 'Super Admin', 'all' => true],
            'editor' => ['name' => 'Biên tập viên', 'keys' => ['view_products', 'manage_products', 'view_categories', 'manage_categories', 'view_blogs', 'manage_blogs', 'view_pages', 'manage_pages', 'view_banners', 'manage_banners', 'view_faqs', 'manage_faqs', 'view_product_questions', 'manage_product_questions', 'view_media', 'manage_media', 'view_orders', 'view_contacts', 'view_reviews', 'view_settings']],
            'viewer' => ['name' => 'Người xem', 'keys' => ['view_products', 'view_categories', 'view_blogs', 'view_pages', 'view_banners', 'view_faqs', 'view_product_questions', 'view_media', 'view_orders', 'view_contacts', 'view_reviews', 'view_settings']],
        ];

        foreach ($roles as $slug => $definition) {
            $roleId = DB::table('roles')->insertGetId([
                'name' => $definition['name'],
                'slug' => $slug,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $permissionIds = $definition['all'] ?? false
                ? DB::table('permissions')->pluck('id')
                : DB::table('permissions')->whereIn('key', $definition['keys'])->pluck('id');

            foreach ($permissionIds as $permissionId) {
                DB::table('permission_role')->insert(['role_id' => $roleId, 'permission_id' => $permissionId]);
            }

            DB::table('users')->where('role', $slug)->update(['role_id' => $roleId]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
        });
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::table('banners', function (Blueprint $table) {
            $table->dropIndex('banners_placement_index');
            $table->dropColumn(['page_key', 'position']);
        });
        Schema::dropIfExists('media');
        Schema::dropIfExists('product_questions');
        Schema::dropIfExists('faqs');
    }
};
