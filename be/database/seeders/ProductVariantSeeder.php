<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductVariantSeeder extends Seeder
{
    public function run(): void
    {
        $variantNames = [
            'Túi 100gram',
            'Túi 100gram + than',
            'Túi 100gram + nến',
            'Túi 100gram + lót bạc + than',
        ];

        foreach (ProductCatalogSeeder::products() as $productIndex => $definition) {
            $product = Product::where('slug', $definition['slug'])->first();
            if (!$product) {
                continue;
            }

            if (isset($definition['has_variants']) && !$definition['has_variants']) {
                $product->variants()->delete();
                continue;
            }

            $skus = collect($variantNames)->keys()->map(
                fn (int $variantIndex) => sprintf('TUE-%02d-%02d', $productIndex + 1, $variantIndex + 1)
            );
            $product->variants()->whereNotIn('sku', $skus)->delete();

            foreach ($variantNames as $variantIndex => $name) {
                ProductVariant::updateOrCreate(
                    ['sku' => sprintf('TUE-%02d-%02d', $productIndex + 1, $variantIndex + 1)],
                    [
                        'product_id' => $product->id,
                        'name' => $name,
                        'price' => 100000,
                        'original_price' => null,
                        'stock' => 100,
                        'image_path' => null,
                        'status' => 'active',
                        'position' => $variantIndex,
                    ]
                );
            }

            $product->update(['price' => 100000, 'original_price' => null]);
        }
    }
}
