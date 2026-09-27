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
        Schema::table('products', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('slug_en')->nullable()->unique()->after('slug');
            $table->text('description_en')->nullable()->after('description');
            $table->json('benefits_en')->nullable()->after('benefits');
            $table->string('badge_en', 50)->nullable()->after('badge');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->string('slug_en')->nullable()->unique()->after('slug');
            $table->text('excerpt_en')->nullable()->after('excerpt');
            $table->json('content_en')->nullable()->after('content');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('slug_en')->nullable()->after('slug');
        });

        Schema::table('banners', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->string('subtitle_en')->nullable()->after('subtitle');
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->string('question_en')->nullable()->after('question');
            $table->text('answer_en')->nullable()->after('answer');
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->string('slug_en')->nullable()->unique()->after('slug');
            $table->longText('content_en')->nullable()->after('content');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->text('value_en')->nullable()->after('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['value_en']);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'slug_en', 'content_en']);
        });

        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['question_en', 'answer_en']);
        });

        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'subtitle_en']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'slug_en']);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'slug_en', 'excerpt_en', 'content_en']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'slug_en', 'description_en', 'benefits_en', 'badge_en']);
        });
    }
};
