<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductCatalogSeeder extends Seeder
{
    public static function products(): array
    {
        return [
            ['name' => 'Tẩy uế xông nhà hơn 20 loại thảo mộc 100gram', 'slug' => 'tay-ue-xong-nha-hon-20-loai-thao-moc-100gram'],
            ['name' => 'Tẩy uế thảo mộc cơ thể giải cảm 100gram', 'slug' => 'tay-ue-thao-moc-co-the-giai-cam-100gram'],
            ['name' => 'Gói tẩy uế xông nhà hơn 22 loại thảo mộc 100gram', 'slug' => 'goi-tay-ue-xong-nha-hon-22-loai-thao-moc-100gram'],
            ['name' => 'Tẩy uế xông nhà trầm hương 100gram', 'slug' => 'tay-ue-xong-nha-tram-huong-100gram'],
            ['name' => 'Tẩy uế xông nhà cỏ gai thanh tẩy trừ tà 100gram', 'slug' => 'tay-ue-xong-nha-co-gai-thanh-tay-tru-ta-100gram'],
            ['name' => 'Tẩy uế xông nhà ngải cứu 100gram', 'slug' => 'tay-ue-xong-nha-ngai-cuu-100gram'],
            ['name' => 'Tẩy uế xông nhà 7 loại gai trừ tà thanh tẩy ô uế ngôi nhà', 'slug' => 'tay-ue-xong-nha-7-loai-gai-tru-ta-thanh-tay-o-ue-ngoi-nha'],
            ['name' => 'Tẩy uế xông nhà 9 loại gai trừ tà thanh tẩy uế ngôi nhà', 'slug' => 'tay-ue-xong-nha-9-loai-gai-tru-ta-thanh-tay-ue-ngoi-nha'],
            ['name' => 'Tẩy uế VIP xông nhà tẩy uế thu hút tiền tài tài lộc cho gia', 'slug' => 'tay-ue-vip-xong-nha-tay-ue-thu-hut-tien-tai-tai-loc-cho-gia'],
            ['name' => 'Tẩy uế xông nhà gừng thanh lọc cơ thể 100gram', 'slug' => 'tay-ue-xong-nha-gung-thanh-loc-co-the-100gram'],
            ['name' => '[Mẫu mới] Tẩy uế xông nhà hơn 20 loại thảo mộc 100gram', 'slug' => 'mau-moi-tay-ue-xong-nha-hon-20-loai-thao-moc-100gram', 'badge' => 'MẪU MỚI'],
            ['name' => 'Lót bạc +11sp', 'slug' => 'lot-bac-11sp', 'has_variants' => false],
            ['name' => 'tặng nến +11 sp', 'slug' => 'tang-nen-11sp', 'has_variants' => false],
            ['name' => 'lót bạc + than +11sp', 'slug' => 'lot-bac-than-11sp', 'has_variants' => false],
            ['name' => 'tặng than +11 sp', 'slug' => 'tang-than-11sp', 'has_variants' => false],
        ];
    }

    public function run(): void
    {
        $category = Category::updateOrCreate(
            ['slug' => 'tay-ue-xong-nha'],
            ['name' => 'Tẩy Uế Xông Nhà', 'type' => 'product']
        );

        foreach (self::products() as $definition) {
            $isAccessory = isset($definition['has_variants']) && !$definition['has_variants'];
            $imagePath = $isAccessory ? '/images/smudge_stick.png' : '/images/' . $definition['slug'] . '.png';

            Product::updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $definition['name'],
                    'price' => 100000,
                    'original_price' => null,
                    'rating' => 5,
                    'description' => $isAccessory ? 'Phụ kiện hỗ trợ xông nhà thanh lọc không gian.' : 'Sản phẩm thảo mộc tẩy uế dùng để thanh lọc không gian và tạo cảm giác dễ chịu cho ngôi nhà.',
                    'image_path' => $imagePath,
                    'benefits' => $isAccessory ? ['Phụ kiện xông nhà', 'Thanh lọc không gian'] : ['Thảo mộc tự nhiên', 'Thanh lọc không gian', 'Túi 100gram'],
                    'badge' => $definition['badge'] ?? null,
                    'status' => 'active',
                    'is_best_seller' => false,
                ]
            );
        }
    }
}
