<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductVariantSeeder extends Seeder
{
    public function run(): void
    {
        $definitions = [
            'bo-thao-moc-xong-nha' => [
                ['name' => 'Gói tiêu chuẩn', 'sku' => 'BTMXN-TIEU-CHUAN', 'price' => 120000, 'original_price' => 150000, 'stock' => 50, 'image_path' => '/images/smudge_stick.png'],
                ['name' => 'Gói lớn', 'sku' => 'BTMXN-GOI-LON', 'price' => 180000, 'original_price' => 220000, 'stock' => 30, 'image_path' => '/images/smudge_stick.png'],
                ['name' => 'Combo 3 gói', 'sku' => 'BTMXN-COMBO-3', 'price' => 330000, 'original_price' => 450000, 'stock' => 20, 'image_path' => '/images/smudge_stick.png'],
            ],
            'nu-tram-thao-moc' => [
                ['name' => 'Hộp 20 nụ', 'sku' => 'NTTM-HOP-20', 'price' => 180000, 'original_price' => 210000, 'stock' => 45, 'image_path' => '/images/incense_cones.png'],
                ['name' => 'Hộp 50 nụ', 'sku' => 'NTTM-HOP-50', 'price' => 380000, 'original_price' => 450000, 'stock' => 25, 'image_path' => '/images/incense_cones.png'],
            ],
            'nuoc-xit-thao-moc-thanh-loc' => [
                ['name' => 'Chai 100 ml', 'sku' => 'NXTM-100ML', 'price' => 220000, 'original_price' => 250000, 'stock' => 40, 'image_path' => '/images/aura_mist.png'],
                ['name' => 'Chai 250 ml', 'sku' => 'NXTM-250ML', 'price' => 420000, 'original_price' => 500000, 'stock' => 18, 'image_path' => '/images/aura_mist.png'],
            ],
            'hop-tra-thao-moc-an-yen' => [
                ['name' => 'Hộp 10 túi lọc', 'sku' => 'HTAY-HOP-10', 'price' => 150000, 'original_price' => 180000, 'stock' => 35, 'image_path' => '/images/herbal_tea.png'],
                ['name' => 'Hộp 20 túi lọc', 'sku' => 'HTAY-HOP-20', 'price' => 260000, 'original_price' => 320000, 'stock' => 22, 'image_path' => '/images/herbal_tea.png'],
            ],
        ];

        foreach ($definitions as $productSlug => $variants) {
            $product = Product::where('slug', $productSlug)->first();
            if (!$product) {
                continue;
            }

            $product->variants()->whereNotIn('sku', collect($variants)->pluck('sku'))->delete();
            foreach ($variants as $position => $variant) {
                ProductVariant::updateOrCreate(
                    ['sku' => $variant['sku']],
                    [
                        'product_id' => $product->id,
                        'name' => $variant['name'],
                        'price' => $variant['price'],
                        'original_price' => $variant['original_price'],
                        'stock' => $variant['stock'],
                        'image_path' => $variant['image_path'],
                        'status' => 'active',
                        'position' => $position,
                    ]
                );
            }

            $product->update([
                'price' => collect($variants)->min('price'),
                'original_price' => collect($variants)->min('original_price'),
            ]);
        }
    }
}
