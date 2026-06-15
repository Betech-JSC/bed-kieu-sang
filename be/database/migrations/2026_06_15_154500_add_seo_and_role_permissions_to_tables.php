<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add seo_title and seo_desc to products table
        Schema::table('products', function (Blueprint $table) {
            $table->string('seo_title')->nullable()->after('badge');
            $table->text('seo_desc')->nullable()->after('seo_title');
        });

        // 2. Add seo_title and seo_desc to blog_posts table
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('seo_title')->nullable()->after('published_at');
            $table->text('seo_desc')->nullable()->after('seo_title');
        });

        // 3. Add seo_title and seo_desc to pages table
        Schema::table('pages', function (Blueprint $table) {
            $table->string('seo_title')->nullable()->after('content');
            $table->text('seo_desc')->nullable()->after('seo_title');
        });

        // 4. Add role and permissions to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('viewer')->after('password');
            $table->json('permissions')->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['seo_title', 'seo_desc']);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['seo_title', 'seo_desc']);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['seo_title', 'seo_desc']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'permissions']);
        });
    }
};
