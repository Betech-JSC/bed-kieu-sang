<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('product_variants', 'name')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->string('name', 150)->nullable()->after('product_id');
            });

            DB::table('product_variants')->whereNull('name')->update(['name' => DB::raw('sku')]);
        }

        Schema::dropIfExists('product_variant_values');
        Schema::dropIfExists('product_option_values');
        Schema::dropIfExists('product_options');
    }

    public function down(): void
    {
        // Compatibility migration: keeping the direct variant name prevents data loss on rollback.
    }
};
