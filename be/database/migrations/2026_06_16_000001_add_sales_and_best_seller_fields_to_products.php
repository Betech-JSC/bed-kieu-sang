<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('channel_one_sales')->default(0)->after('rating');
            $table->unsignedInteger('channel_two_sales')->default(0)->after('channel_one_sales');
            $table->unsignedInteger('virtual_sales')->default(0)->after('channel_two_sales');
            $table->unsignedInteger('real_sales')->default(0)->after('virtual_sales');
            $table->boolean('is_best_seller')->default(false)->after('badge');

            $table->index('is_best_seller');
        });

        if (Schema::hasTable('settings')) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'social_proof_sales_count'],
                [
                    'value' => '50000',
                    'type' => 'number',
                    'group' => 'homepage',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            DB::table('settings')->updateOrInsert(
                ['key' => 'social_proof_rating'],
                [
                    'value' => '4.9',
                    'type' => 'text',
                    'group' => 'homepage',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_best_seller']);
            $table->dropColumn([
                'channel_one_sales',
                'channel_two_sales',
                'virtual_sales',
                'real_sales',
                'is_best_seller',
            ]);
        });

        if (Schema::hasTable('settings')) {
            DB::table('settings')
                ->whereIn('key', ['social_proof_sales_count', 'social_proof_rating'])
                ->delete();
        }
    }
};
