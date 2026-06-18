<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\Setting;
use App\Models\Banner;
use App\Models\Contact;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Testimonial;
use App\Models\Page;
use App\Models\SeoRedirect;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin Users with Roles
        User::updateOrCreate(
            ['email' => 'admin@xongnhatayue.vn'],
            [
                'name' => 'Quản trị Xông Nhà Tẩy Uế',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'role_id' => Role::where('slug', 'super_admin')->value('id'),
                'permissions' => [],
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@xongnhatayue.vn'],
            [
                'name' => 'Biên tập Xông Nhà Tẩy Uế',
                'password' => Hash::make('editor123'),
                'role' => 'editor',
                'role_id' => Role::where('slug', 'editor')->value('id'),
                'permissions' => [],
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'viewer@xongnhatayue.vn'],
            [
                'name' => 'Người xem Xông Nhà Tẩy Uế',
                'password' => Hash::make('viewer123'),
                'role' => 'viewer',
                'role_id' => Role::where('slug', 'viewer')->value('id'),
                'permissions' => [],
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Categories
        $catSmudge = Category::updateOrCreate(['slug' => 'thanh-loc-khong-gian'], ['name' => 'Thanh Lọc Không Gian', 'type' => 'product']);
        $catRelax = Category::updateOrCreate(['slug' => 'thu-gian-tinh-than'], ['name' => 'Thư Giãn Tinh Thần', 'type' => 'product']);
        $catTea = Category::updateOrCreate(['slug' => 'tra-an-yen'], ['name' => 'Trà An Yên', 'type' => 'product']);

        $catFengShui = Category::updateOrCreate(['slug' => 'phong-thuy'], ['name' => 'Phong Thủy', 'type' => 'blog']);
        $catWellness = Category::updateOrCreate(['slug' => 'wellness'], ['name' => 'Wellness', 'type' => 'blog']);

        // 3. Create Seeded Products (From web/src/data/products.ts)
        Product::updateOrCreate(
            ['slug' => 'bo-thao-moc-xong-nha'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Bó Thảo Mộc Xông Nhà',
                'price' => 120000,
                'rating' => 4.8,
                'description' => 'Sự kết hợp hoàn hảo giữa lá ngải cứu khô, sả chanh thơm mát và vỏ quế cay nồng. Thích hợp xông nhà tẩy trần, mang lại không khí thanh sạch và xua tan khí xấu.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['Organic', 'Thủ Công', 'Thanh Lọc Khí'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'nu-tram-thao-moc'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Nụ Trầm Thảo Mộc',
                'price' => 180000,
                'rating' => 4.9,
                'description' => 'Được làm từ bột trầm hương nguyên chất kết hợp các vị thuốc Bắc thảo mộc. Hương thơm dịu nhẹ, ngọt ngào, giúp tĩnh tâm khi thiền định, đọc sách hoặc làm việc.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Tĩnh Tâm', 'Trầm Hương', 'Thư Giãn'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'nuoc-xit-thao-moc-thanh-loc'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Nước Xịt Thảo Mộc Thanh Lọc',
                'price' => 220000,
                'rating' => 4.7,
                'description' => 'Tinh dầu bưởi bung, vỏ cam ngọt và ngải cứu dạng phun sương. Chỉ cần 2-3 xịt giúp khử mùi ẩm mốc tức thì, tiếp thêm năng lượng tích cực cho căn phòng.',
                'image_path' => '/images/aura_mist.png',
                'benefits' => ['Khử Mùi', 'Kháng Khuẩn', 'Hương Vỏ Cam'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'hop-tra-thao-moc-an-yen'],
            [
                'category_id' => $catTea->id,
                'name' => 'Hộp Trà Thảo Mộc An Yên',
                'price' => 150000,
                'rating' => 4.9,
                'description' => 'Trà thảo mộc kết hợp hoa cúc chi ấm áp, kỳ tử đỏ và tâm sen an thần. Hỗ trợ giấc ngủ sâu, thư giãn hệ thần kinh sau những giờ làm việc mệt mỏi.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Ngủ Ngon', 'Thải Độc', 'Hoa Cúc Chi'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        // New products
        Product::updateOrCreate(
            ['slug' => 'tinh-dau-vo-buoi-hong'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Tinh Dầu Vỏ Bưởi Hồng',
                'price' => 190000,
                'rating' => 5.0,
                'description' => 'Tinh dầu bưởi hồng nguyên chất, hương thơm ngọt ngào tiếp thêm năng lượng và giải tỏa mệt mỏi.',
                'image_path' => '/images/aura_mist.png',
                'benefits' => ['Nguyên Chất', 'Bưởi Hồng', 'Hương Thơm'],
                'badge' => 'NEW',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'nhang-khoanh-dan-huong'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Nhang Khoanh Đàn Hương',
                'price' => 320000,
                'rating' => 4.9,
                'description' => 'Nhang khoanh làm từ bột gỗ đàn hương lâu năm, thích hợp cho thời gian tĩnh tâm kéo dài.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Đàn Hương', 'Tĩnh Tâm', 'Cháy 4 Giờ'],
                'badge' => 'NEW',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'de-dot-tram-gom-men-ran'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Đế Đốt Trầm Gốm Men Rạn',
                'price' => 250000,
                'rating' => 4.8,
                'description' => 'Khay đốt trầm bằng gốm thủ công tráng men rạn sang trọng, phong cách cổ điển Á Đông.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['Gốm Thủ Công', 'Mỹ Thuật', 'Á Đông'],
                'badge' => 'NEW',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'hop-tra-sen-tuyet-co-thu'],
            [
                'category_id' => $catTea->id,
                'name' => 'Hộp Trà Sen Tuyết Cổ Thụ',
                'price' => 280000,
                'rating' => 4.9,
                'description' => 'Trà tuyết shan cổ thụ ướp hương hoa sen Hồ Tây thanh khiết, thơm dịu nhẹ vị ngọt hậu sâu.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Trà Cổ Thụ', 'Sen Tây Hồ', 'Thanh Lọc'],
                'badge' => 'NEW',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'bo-thao-moc-oai-huong-kho'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Bó Thảo Mộc Oải Hương Khô',
                'price' => 150000,
                'rating' => 4.7,
                'description' => 'Bó hoa oải hương khô tự nhiên nhập khẩu Pháp kết hợp lá xô thơm thanh khiết.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['Lavender', 'Thư Giãn', 'Bình An'],
                'badge' => 'NEW',
                'status' => 'active'
            ]
        );

        // Sale products
        Product::updateOrCreate(
            ['slug' => 'combo-3-bo-xong-nha-cat-tuong'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Combo 3 Bó Xông Nhà Cát Tường',
                'price' => 300000,
                'original_price' => 360000,
                'rating' => 4.9,
                'description' => 'Bộ ba bó thảo mộc ngải cứu sả quế xông nhà tẩy uế tiết kiệm cho cả gia đình.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['Tiết Kiệm', 'Combo 3 Bó', 'Thanh Lọc'],
                'badge' => '-16%',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tinh-dau-cam-ngot-nguyen-chat'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Tinh Dầu Cam Ngọt Nguyên Chất',
                'price' => 135000,
                'original_price' => 160000,
                'rating' => 4.8,
                'description' => 'Tinh dầu cam ngọt ép lạnh giúp thanh lọc không khí, xua tan căng thẳng mệt mỏi.',
                'image_path' => '/images/aura_mist.png',
                'benefits' => ['Cam Ngọt', 'Thư Giãn', 'Hương Thơm'],
                'badge' => '-15%',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'lu-xong-tram-dong-hun-co'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Lư Xông Trầm Đồng Hun Cổ',
                'price' => 390000,
                'original_price' => 480000,
                'rating' => 5.0,
                'description' => 'Lư đốt trầm hương bằng chất liệu đồng đúc thủ công tinh xảo phong cách cổ điển.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Đồng Nguyên Chất', 'Thủ Công', 'Đẹp Mắt'],
                'badge' => '-18%',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'hop-nu-tram-dac-biet-hop-go'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Hộp Nụ Trầm Đặc Biệt (Hộp Gỗ)',
                'price' => 340000,
                'original_price' => 400000,
                'rating' => 4.9,
                'description' => '40 nụ trầm hương thượng hạng đựng trong hộp gỗ gụ lót nhung sang trọng, thích hợp làm quà tặng.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Thượng Hạng', 'Hộp Quà Tặng', 'Trầm Hương'],
                'badge' => '-15%',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tra-hoa-cuc-vang-tien-vua'],
            [
                'category_id' => $catTea->id,
                'name' => 'Trà Hoa Cúc Vàng Tiến Vua',
                'price' => 125000,
                'original_price' => 150000,
                'rating' => 4.8,
                'description' => 'Trà hoa cúc chi sấy khô tự nhiên vùng Nghĩa Trai hái tay thủ công, giải nhiệt tiêu uế.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Cúc Chi', 'Hái Tay', 'Organic'],
                'badge' => '-17%',
                'status' => 'active'
            ]
        );

        // 4. Create Blog Posts (From web/src/data/blog-posts.ts)
        BlogPost::updateOrCreate(
            ['slug' => 'bi-quyet-xong-nha-tay-ue'],
            [
                'category_id' => $catFengShui->id,
                'title' => 'Nghệ thuật xông nhà tẩy uế: Đón vượng khí, tẩy tà khí tích tụ',
                'excerpt' => 'Khám phá cách sử dụng sả chanh, ngải cứu và vỏ quế khô để thanh lọc sinh khí cho ngôi nhà của bạn, khơi thông tài lộc dòng năng lượng.',
                'content' => [
                    'Không gian sống của chúng ta không đơn thuần chỉ là những bức tường gạch vô tri, mà là một thực thể năng lượng liên tục tích tụ và trao đổi sinh khí. Trải qua những ngày mưa ẩm ướt, những khoảng thời gian gia đình có người ốm đau, hoặc đơn giản là sự uể oải sau những lo toan cuộc sống, tà khí và năng lượng trì trệ dễ dàng đọng lại trong các góc khuất của ngôi nhà.',
                    'Xông nhà tẩy uế là một nghi thức truyền thống tốt đẹp từ ngàn xưa, kết hợp hài hòa giữa yếu tố tâm linh Á Đông và liệu pháp thảo dược tự nhiên. Nghi thức này giúp xua tan đi chướng khí, làm sạch bầu không khí vật lý, đồng thời tái lập dòng sinh khí (Chi) hanh thông và tích cực nhất đón tài lộc vào nhà.',
                    'Để thực hiện nghi thức này, bó thảo mộc khô kết hợp lá ngải cứu khô sấy, sả chanh thơm mát cùng vỏ quế cay nồng là lựa chọn hoàn hảo nhất. Khi thảo mộc cháy âm ỉ tỏa khói thơm dịu nhẹ, làn khói ấy mang theo tinh dầu quý giá len lỏi qua từng kẽ lá, khử đi mùi ẩm mốc khó chịu và xua đuổi côn trùng hiệu quả.',
                    'Các bước tiến hành xông nhà đúng phong thủy:',
                    '1. Dọn dẹp sạch sẽ: Hãy bắt đầu dọn dẹp gọn gàng đồ đạc trong nhà, mở to các cửa sổ và cửa ra vào để dòng khí cũ thoát đi dễ dàng hơn.',
                    '2. Đốt thảo mộc: Đốt một đầu bó thảo mộc hoặc nụ trầm thảo mộc, quạt nhẹ để ngọn lửa tắt đi và giữ cho khói tỏa âm ỉ.',
                    '3. Di chuyển quanh nhà: Cầm đĩa đựng thảo mộc đi dọc theo các bức tường, đi từ trên xuống dưới, từ trong ra ngoài. Tập trung xông kỹ tại các góc tối, chân cầu thang và những nơi ít ánh sáng mặt trời.',
                    '4. Gửi gắm nguyện ước: Trong suốt quá trình xông, hãy giữ tâm trí bình an, hướng lòng mình đến sự thanh sạch, an yên và những điều cát tường cho gia đình.',
                    'Sau khi hoàn thành xông nhà, bạn sẽ ngay lập tức cảm thấy tinh thần nhẹ nhõm, không gian phòng ốc thông thoáng và mang một nguồn năng lượng sống hoàn toàn mới.'
                ],
                'image_path' => '/images/smudge_stick.png',
                'read_time' => '5 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'lieu-phap-huong-thom-giam-stress'],
            [
                'category_id' => $catWellness->id,
                'title' => 'Liệu pháp hương thơm tự nhiên: Đánh thức giác quan và giấc ngủ sâu',
                'excerpt' => 'Tinh dầu vỏ bưởi hồng và hương trầm thảo mộc hỗ trợ giải tỏa mệt mỏi hệ thần kinh, xua tan áp lực và giúp bạn có giấc ngủ an lành.',
                'content' => [
                    'Trong guồng quay hối hả của cuộc sống hiện đại, hệ thần kinh của chúng ta liên tục bị quá tải bởi ánh sáng xanh từ màn hình điện thoại, tiếng ồn đô thị và áp lực công việc dồn nén. Sau một ngày dài, cơ thể và tâm trí thèm khát một không gian tĩnh lặng, an lành để chữa lành và phục hồi.',
                    'Liệu pháp hương thơm (Aromatherapy) bằng các tinh dầu thảo dược chiết xuất từ thiên nhiên là con đường ngắn nhất kết nối giác quan với trạng thái thư giãn sâu. Khi hít thở hương thơm dịu nhẹ từ vỏ bưởi bung hay trầm hương, các phân tử hương sẽ kích thích hệ viền của não bộ, lập tức giảm nồng độ hormone cortisol gây căng thẳng.',
                    'Đặc biệt, sự kết hợp giữa hương vỏ cam ngọt thanh thoát cùng ngải cứu tươi mát dạng phun sương xịt phòng giúp thanh tẩy năng lượng tiêu cực nhanh chóng. Không khí phòng ngủ mát lành hương thảo mộc làm giảm nhịp tim, làm dịu tâm trí, mở lối cho một giấc ngủ ngon sâu và tinh tế.',
                    'Cách ứng dụng tinh dầu hiệu quả cho giấc ngủ an yên:',
                    '- Sử dụng nước xịt thảo mộc phun sương nhẹ lên gối hoặc ga giường khoảng 10 phút trước khi ngủ.',
                    '- Đốt một nụ trầm thảo mộc nhẹ nhàng trong không gian phòng khách hoặc phòng đọc sách để thanh lọc tâm trí trước khi bước vào phòng ngủ.',
                    '- Kết hợp với việc thở sâu bằng bụng: hít vào hương thơm an lành của đất trời và thở ra tất cả những lo toan mệt mỏi tích tụ.',
                    'Hãy để Thảo Mộc Kiều Sang đồng hành cùng góc nhỏ an yên của bạn, nơi khói trầm dịu nhẹ xoa dịu mọi vết thương tâm hồn và nuôi dưỡng năng lượng sống mỗi ngày.'
                ],
                'image_path' => '/images/aura_mist.png',
                'read_time' => '4 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'phong-thuy-ngu-hanh-khong-gian-song'],
            [
                'category_id' => $catFengShui->id,
                'title' => 'Cân bằng năng lượng ngũ hành: Bí quyết cho không gian sống an yên',
                'excerpt' => 'Sắp xếp và sử dụng các sản phẩm thảo mộc tự nhiên theo nguyên lý ngũ hành phương Đông giúp điều hòa dòng khí lưu thông cát tường.',
                'content' => [
                    'Nguyên lý Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) là nền tảng triết học phương Đông giải thích sự vận động của vạn vật trong vũ trụ. Khi áp dụng vào không gian nhà ở, một ngôi nhà có phong thủy tốt là nơi dòng năng lượng của năm yếu tố này đạt được sự tương sinh, hỗ trợ lẫn nhau hài hòa nhất.',
                    'Tuy nhiên, cuộc sống đô thị chật hẹp cùng các vật liệu nhân tạo như kim loại cứng nhắc, nhựa tổng hợp làm dòng khí tự nhiên bị chặn đứng, dẫn đến sự thiếu hụt hành Mộc và hành Thổ tự nhiên trong nhà.',
                    'Thảo mộc tự nhiên Kiều Sang đại diện cho hành Mộc (lá cây ngải cứu, vỏ cam khô) và hành Thổ (đất lành nuôi dưỡng các loài thảo mộc, hương trầm mộc mạc âm ỉ). Khi đốt thảo mộc, ngọn lửa hành Hỏa tương sinh kết hợp với dòng khói tỏa mang theo hương thơm thanh mát của hành Thủy tinh khiết, giúp cân bằng và trung hòa các năng lượng Kim cứng nhắc trong các căn hộ hiện đại.',
                    'Bí quyết sắp xếp phong thủy thảo mộc trong nhà:',
                    '- Khu vực Phía Đông (Hành Mộc - Sức khỏe): Thích hợp đặt các bó thảo mộc hoặc trà hoa cúc vàng để nuôi dưỡng sinh khí, đem lại năng lượng tươi mới cho sức khỏe gia đình.',
                    '- Khu vực Phía Nam (Hành Hỏa - Danh tiếng & Năng lượng): Rất thích hợp đốt nụ trầm hương thảo mộc để kích hoạt dòng vượng khí nhiệt huyết, hanh thông vận số sự nghiệp.',
                    '- Khu vực Phía Tây (Hành Kim - Sáng tạo): Sử dụng nước xịt thảo mộc hương vỏ bưởi nhẹ nhàng để gột rửa bụi bẩn năng lượng, kích thích trí óc sáng tạo tinh thông.',
                    'Sự kết hợp tinh tế giữa hương thơm trị liệu và nguyên lý tương sinh ngũ hành sẽ giúp ngôi nhà của bạn biến thành một ốc đảo yên bình thực sự, nơi cơ thể được nạp đầy năng lượng tích cực sau mỗi ngày làm việc.'
                ],
                'image_path' => '/images/incense_cones.png',
                'read_time' => '6 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'tra-thao-moc-thanh-loc-co-the'],
            [
                'category_id' => $catWellness->id,
                'title' => 'Trà thảo mộc an yên: Bí quyết thanh lọc cơ thể mỗi sớm mai',
                'excerpt' => 'Nuôi dưỡng sức khỏe tinh tế với các loại trà thảo mộc từ sả chanh, hoa cúc vàng bản địa giúp thanh lọc cơ thể và mang lại tinh thần phấn chấn.',
                'content' => [
                    'Thói quen bắt đầu buổi sáng bằng một tách trà thảo mộc nóng hổi từ lâu đã trở thành một phần không thể thiếu trong lối sống an yên của người Việt. Khác với trà xanh truyền thức chứa caffeine dễ làm cồn cào ruột gan lúc đói, trà thảo mộc được kết hợp từ các loài cây dược liệu lành tính giúp đánh thức cơ thể một cách nhẹ nhàng và tinh tế nhất.',
                    'Để có một ly trà thanh lọc chuẩn vị, sự kết hợp giữa hoa cúc vàng sấy lạnh cùng sả chanh và một lát gừng mỏng là bí quyết hoàn hảo. Hương thơm ấm áp ngọt ngào của cúc hoa hòa quyện với vị cay nồng dịu nhẹ giúp kích hoạt hệ tiêu hóa, thải trừ độc tố tích tụ sau một đêm dài ngủ sâu.',
                    'Lợi ích tuyệt vời của việc uống trà thảo mộc mỗi sáng:',
                    '- Thanh lọc và bù nước: Tăng cường quá trình trao đổi chất tự nhiên, loại bỏ các chất cặn bã trong hệ tiêu hóa.',
                    '- Xoa dịu tinh thần: Hương thơm tự nhiên giúp giảm lo âu, mang lại tâm thế bình tĩnh để bắt đầu ngày mới hiệu quả.',
                    '- Chống oxy hóa vượt trội: Các dưỡng chất từ hoa cúc sấy khô bảo vệ tế bào khỏi tác hại của các gốc tự do.',
                    'Hãy cùng Thảo Mộc Kiều Sang duy trì thói quen uống trà an yên mỗi ngày để nuôi dưỡng một tâm hồn bình lặng và một cơ thể tràn đầy sinh khí.'
                ],
                'image_path' => '/images/herbal_tea.png',
                'read_time' => '5 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        // 5. Create Settings
        Setting::updateOrCreate(['key' => 'store_hotline'], ['value' => '0987.654.321', 'type' => 'text', 'group' => 'contact']);
        Setting::updateOrCreate(['key' => 'store_email'], ['value' => 'lienhe@kieusang.vn', 'type' => 'text', 'group' => 'contact']);
        Setting::updateOrCreate(['key' => 'store_address'], ['value' => 'Số 12 Ngách Yên Tĩnh, Quận An Nhiên, Hà Nội', 'type' => 'text', 'group' => 'contact']);
        Setting::updateOrCreate(['key' => 'social_proof_sales_count'], ['value' => '50000', 'type' => 'number', 'group' => 'homepage']);
        Setting::updateOrCreate(['key' => 'social_proof_rating'], ['value' => '4.9', 'type' => 'text', 'group' => 'homepage']);
        
        // Global SEO Settings (Vietnamese only)
        Setting::updateOrCreate(['key' => 'meta_title'], ['value' => 'Thảo Mộc Kiều Sang - Sống Xanh, An Yên', 'type' => 'text', 'group' => 'seo']);
        Setting::updateOrCreate(['key' => 'meta_desc'], ['value' => 'Thương hiệu thảo mộc thiên nhiên, thanh tẩy không gian, liệu pháp mùi hương hữu cơ an lành cho sức khỏe.', 'type' => 'text', 'group' => 'seo']);
        Setting::updateOrCreate(['key' => 'meta_keywords'], ['value' => 'thao moc, kieu sang, white sage, organic, tra hoa cuc, xong nha', 'type' => 'text', 'group' => 'seo']);

        // 6. Create Extra Products for pagination testing
        Product::updateOrCreate(
            ['slug' => 'la-xo-thom-trang-tay-rua'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Lá Xô Thơm Trắng Tẩy Rửa',
                'price' => 160000,
                'rating' => 4.9,
                'description' => 'Lá xô thơm trắng White Sage nhập khẩu trực tiếp từ California, Mỹ. Dùng xông nhà thanh tẩy đá phong thủy, bài trừ khí xấu.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['California', 'Thanh Tẩy Đá', 'Xô Thơm'],
                'badge' => 'BEST',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'nhang-tram-khong-tam'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Nhang Trầm Không Tăm',
                'price' => 290000,
                'rating' => 4.8,
                'description' => 'Nhang trầm hương không tăm cao cấp, mùi thơm ngọt thanh sạch. Đựng trong hộp gỗ tre tinh xảo.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Không Tăm', 'Cao Cấp', 'Khay Tre'],
                'badge' => 'HOT',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'go-trac-xanh-thanh-tay'],
            [
                'category_id' => $catSmudge->id,
                'name' => 'Gỗ Trắc Xanh Thanh Tẩy',
                'price' => 110000,
                'rating' => 4.6,
                'description' => 'Thanh gỗ trắc xanh Palo Santo tự nhiên từ Nam Mỹ. Mùi thơm ấm nồng đặc trưng giúp thanh tẩy không gian.',
                'image_path' => '/images/smudge_stick.png',
                'benefits' => ['Palo Santo', 'Nam Mỹ', 'Thơm Ấm'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tinh-dau-bac-ha-nguyen-chat'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Tinh Dầu Bạc Hà Nguyên Chất',
                'price' => 140000,
                'rating' => 4.7,
                'description' => 'Tinh dầu bạc hà nguyên chất chưng cất hơi nước, mang lại cảm giác mát lạnh sảng khoái và tăng độ tập trung.',
                'image_path' => '/images/aura_mist.png',
                'benefits' => ['Bạc Hà', 'Mát Lạnh', 'Tập Trung'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tinh-dau-oai-huong-phap'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Tinh Dầu Oải Hương Pháp',
                'price' => 210000,
                'rating' => 4.9,
                'description' => 'Tinh dầu oải hương True Lavender nhập khẩu Pháp, mùi thơm hoa cỏ dịu ngọt giúp ngủ ngon và sâu giấc.',
                'image_path' => '/images/aura_mist.png',
                'benefits' => ['Pháp', 'Lavender', 'Thư Giãn'],
                'badge' => 'POPULAR',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'sap-thom-thao-moc-treo-phong'],
            [
                'category_id' => $catRelax->id,
                'name' => 'Sáp Thơm Thảo Mộc Treo Phòng',
                'price' => 95000,
                'rating' => 4.5,
                'description' => 'Sáp đậu nành tự nhiên kết hợp hoa khô và tinh dầu nguyên chất, dùng treo tủ quần áo hoặc phòng nhỏ.',
                'image_path' => '/images/incense_cones.png',
                'benefits' => ['Sáp Đậu Nành', 'Hoa Khô', 'Treo Tủ'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'hop-tra-duong-nhan-quy-phi'],
            [
                'category_id' => $catTea->id,
                'name' => 'Hộp Trà Dưỡng Nhan Quý Phi',
                'price' => 170000,
                'rating' => 4.9,
                'description' => 'Sự kết hợp của táo đỏ, kỷ tử, long nhãn, nụ hồng tây tạng và đông trùng hạ thảo giúp bổ khí huyết đẹp da.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Táo Đỏ Kỷ Tử', 'Đẹp Da', 'Bổ Huyết'],
                'badge' => 'LADY',
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tra-sam-dua-tinh-khiet'],
            [
                'category_id' => $catTea->id,
                'name' => 'Trà Sâm Dứa Tinh Khiết',
                'price' => 85000,
                'rating' => 4.6,
                'description' => 'Trà sâm dứa đặc sản thơm hương lá dứa tự nhiên, giải khát thanh lọc gan hiệu quả.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Hương Lá Dứa', 'Giải Khát', 'Mát Gan'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'tra-hoa-nhai-tay-bac'],
            [
                'category_id' => $catTea->id,
                'name' => 'Trà Hoa Nhài Tây Bắc',
                'price' => 130000,
                'rating' => 4.8,
                'description' => 'Nụ hoa nhài Tây Bắc sấy mộc tự nhiên, hương nhài thanh tao ngọt hậu dễ chịu.',
                'image_path' => '/images/herbal_tea.png',
                'benefits' => ['Nụ Hoa Nhài', 'Tây Bắc', 'Thanh Tao'],
                'badge' => null,
                'status' => 'active'
            ]
        );

        // 7. Create Extra Blog Posts
        BlogPost::updateOrCreate(
            ['slug' => 'huong-dan-thien-dinh-voi-tram'],
            [
                'category_id' => $catWellness->id,
                'title' => 'Hướng dẫn thiền định kết hợp nụ trầm hương thảo mộc',
                'excerpt' => 'Cách tạo không gian thiền định yên tĩnh và ứng dụng trầm hương để tập trung hơi thở sâu.',
                'content' => [
                    'Thiền định là phương pháp tuyệt vời để tìm lại sự bình yên trong tâm trí giữa bộn bề cuộc sống. Tuy nhiên, đối với người mới bắt đầu, việc tập trung tư tưởng và ổn định hơi thở thường rất khó khăn do những suy nghĩ tạp niệm liên tục xuất hiện.',
                    'Sử dụng nụ trầm thảo mộc làm chất dẫn hương trong lúc ngồi thiền là một phương pháp cổ xưa nhưng vô cùng hiệu quả. Làn khói trầm hương mỏng nhẹ, bay bổng mang mùi hương ngọt ấm, mộc mạc giúp làm dịu nhịp tim và hệ thần kinh, tạo ra một ranh giới năng lượng bảo vệ tâm trí bạn khỏi tiếng ồn xung quanh.',
                    'Trước khi thiền, hãy chuẩn bị một chiếc đĩa gốm hoặc lư xông trầm nhỏ. Đốt nụ trầm, đặt ở vị trí cách chỗ bạn ngồi khoảng 1,5 - 2 mét để hương thơm lan tỏa vừa phải. Nhắm mắt lại, hít sâu hương trầm dịu ấm và thở ra chậm rãi. Hãy tập trung sự chú ý vào điểm chạm của luồng gió ở đầu mũi và hương thơm thanh khiết để dễ dàng đi vào trạng thái định tĩnh.'
                ],
                'image_path' => '/images/incense_cones.png',
                'read_time' => '3 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'tra-thao-moc-cho-giac-ngu-ngon'],
            [
                'category_id' => $catWellness->id,
                'title' => 'Top 3 loại trà thảo mộc giúp cải thiện giấc ngủ tự nhiên',
                'excerpt' => 'Khám phá tác dụng thần kỳ của hoa cúc, tâm sen và oải hương đối với giấc ngủ đêm sâu giấc.',
                'content' => [
                    'Mất ngủ hoặc ngủ không sâu giấc kéo dài là nguyên nhân chính dẫn đến suy giảm sức đề kháng và lão hóa nhanh. Thay vì lạm dụng các loại thuốc an thần hóa học có hại, trà thảo mộc tự nhiên là giải pháp chữa lành dịu nhẹ, an toàn tuyệt đối.',
                    '1. Trà hoa cúc chi ấm áp: Chứa chất apigenin liên kết với các thụ thể trong não giúp gây buồn ngủ và giảm stress thần kinh.',
                    '2. Trà tâm sen truyền thống: Vị đắng nhẹ thanh nhiệt, dưỡng tâm an thần cực tốt cho người lớn tuổi hoặc làm việc áp lực cao.',
                    '3. Trà hoa hồng kỷ tử: Bổ huyết, tăng cường lưu thông máu giúp đầu óc nhẹ nhàng, ngủ ngon giấc và thức dậy sảng khoái.',
                    'Hãy thưởng thức một tách trà thảo mộc ấm trước khi đi ngủ 30 phút để chuẩn bị cho một giấc ngủ thật êm đềm.'
                ],
                'image_path' => '/images/herbal_tea.png',
                'read_time' => '4 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'palo-santo-va-white-sage-khac-nhau-the-nao'],
            [
                'category_id' => $catFengShui->id,
                'title' => 'Phân biệt gỗ trắc xanh (Palo Santo) và lá xô thơm trắng (White Sage)',
                'excerpt' => 'So sánh mùi hương, nguồn gốc và mục đích sử dụng phong thủy của hai loại thảo mộc thanh tẩy phổ biến nhất.',
                'content' => [
                    'Cả gỗ trắc xanh và xô thơm trắng đều là những thảo mộc thanh tẩy năng lượng kinh điển được sử dụng rộng rãi trên thế giới. Tuy nhiên, chúng có những đặc tính mùi hương và công năng phong thủy khác biệt.',
                    'Lá xô thơm trắng (White Sage) mang mùi hương mạnh mẽ, hơi hăng cay đặc trưng. Làn khói xô thơm dày đặc có tính tẩy rửa cực mạnh, cuốn trôi đi tất cả năng lượng trì trệ, bụi bặm trong không gian. Nó giống như một chiếc chổi quét sạch mọi thứ, trả lại không gian trống rỗng nguyên bản.',
                    'Ngược lại, gỗ trắc xanh (Palo Santo) lại mang hương gỗ ấm áp ngọt ngào lẫn chút mùi thông và cam quýt. Palo Santo không chỉ làm sạch mà còn tiếp thêm nguồn năng lượng tích cực, sự may mắn và bình an cho căn phòng.',
                    'Lời khuyên: Bạn nên xông xô thơm trắng trước để dọn dẹp sạch năng lượng xấu, sau đó đốt gỗ trắc xanh để thu hút vượng khí và may mắn.'
                ],
                'image_path' => '/images/smudge_stick.png',
                'read_time' => '5 phút đọc',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        // 8. Create Banners
        Banner::updateOrCreate(
            ['image_path' => '/images/hero_lifestyle.png'],
            [
                'title' => 'Chào mừng tới Thảo Mộc Kiều Sang',
                'subtitle' => 'Liệu pháp hương thơm xanh cho tâm hồn an yên',
                'link_url' => '/products',
                'order_index' => 1,
                'status' => 'active'
            ]
        );

        Banner::updateOrCreate(
            ['image_path' => '/images/herbal_tea.png'],
            [
                'title' => 'Trà Thảo Mộc An Yên',
                'subtitle' => 'Duy trì thói quen lành mạnh mỗi ngày',
                'link_url' => '/products?category=tra-an-yen',
                'order_index' => 2,
                'status' => 'active'
            ]
        );

        Banner::updateOrCreate(
            ['image_path' => '/images/smudge_stick.png'],
            [
                'title' => 'Thanh Lọc Không Gian Sống',
                'subtitle' => 'Xua tan chướng khí đón tài lộc cát tường',
                'link_url' => '/products?category=thanh-loc-khong-gian',
                'order_index' => 3,
                'status' => 'active'
            ]
        );

        Banner::updateOrCreate(
            ['image_path' => '/images/aura_mist.png'],
            [
                'title' => 'Khuyến Mãi Đặc Biệt Mùa Hè',
                'subtitle' => 'Ưu đãi lên tới 20% cho tất cả các loại tinh dầu',
                'link_url' => '/products?category=thu-gian-tinh-than',
                'order_index' => 4,
                'status' => 'inactive'
            ]
        );

        // 9. Create Testimonials
        Testimonial::create([
            'customer_name' => 'Nguyễn Thị Minh An',
            'customer_avatar' => null,
            'rating' => 5,
            'comment' => 'Bó thảo mộc xông nhà mùi thơm tự nhiên ấm áp vô cùng. Mình xông xong thấy phòng thông thoáng hẳn.',
            'is_featured' => true,
            'status' => 'approved'
        ]);

        Testimonial::create([
            'customer_name' => 'Trần Quang Huy',
            'customer_avatar' => null,
            'rating' => 5,
            'comment' => 'Nụ trầm thảo mộc ngọt thanh dịu nhẹ. Đốt lúc đọc sách hoặc làm việc rất tĩnh tâm.',
            'is_featured' => true,
            'status' => 'approved'
        ]);

        Testimonial::create([
            'customer_name' => 'Lê Thanh Bình',
            'customer_avatar' => null,
            'rating' => 4,
            'comment' => 'Trà cúc chi thơm, ngủ ngon giấc hơn. Giao hàng ở Hà Nội nhanh chóng.',
            'is_featured' => false,
            'status' => 'approved'
        ]);

        Testimonial::create([
            'customer_name' => 'Phạm Kim Chi',
            'customer_avatar' => null,
            'rating' => 5,
            'comment' => 'Nước xịt phòng ngải cứu cam ngọt cực kỳ thích, khử sạch mùi ẩm mốc phòng điều hòa.',
            'is_featured' => true,
            'status' => 'approved'
        ]);

        Testimonial::create([
            'customer_name' => 'Vũ Hải Long',
            'customer_avatar' => null,
            'rating' => 3,
            'comment' => 'Sản phẩm tốt nhưng bao gói hộp quà hơi móp nhẹ do bên vận chuyển.',
            'is_featured' => false,
            'status' => 'approved'
        ]);

        Testimonial::create([
            'customer_name' => 'Đặng Thu Trang',
            'customer_avatar' => null,
            'rating' => 5,
            'comment' => 'Gỗ trắc xanh palo santo thơm ngọt tự nhiên, rất thích cách phục vụ nhiệt tình của shop.',
            'is_featured' => false,
            'status' => 'pending'
        ]);

        // 10. Create Pages
        Page::updateOrCreate(
            ['slug' => 'gioi-thieu'],
            [
                'title' => 'Giới thiệu về Thảo Mộc Kiều Sang',
                'content' => '<p>Thảo Mộc Kiều Sang tự hào là thương hiệu Việt Nam mang đến các liệu pháp mùi hương thuần tự nhiên giúp chữa lành tâm hồn và thanh tẩy không gian sống.</p><p>Sản phẩm của chúng tôi được hái tay thủ công, phơi sấy mộc và bảo tồn nguyên vẹn hương thơm mộc mạc tinh túy từ đất mẹ.</p>',
                'meta_title' => 'Giới thiệu Kiều Sang | Thảo mộc tự nhiên',
                'meta_description' => 'Khám phá câu chuyện thương hiệu Thảo Mộc Kiều Sang và sứ mệnh đem liệu pháp hương thơm chữa lành tâm hồn Việt.',
                'meta_keywords' => 'gioi thieu kieu sang, thao moc tu nhien, chua lanh',
                'seo_title' => 'Giới thiệu Kiều Sang | Thảo mộc tự nhiên',
                'seo_desc' => 'Khám phá câu chuyện thương hiệu Thảo Mộc Kiều Sang và sứ mệnh đem liệu pháp hương thơm chữa lành tâm hồn Việt.',
                'status' => 'published'
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'chinh-sach-bao-mat'],
            [
                'title' => 'Chính sách bảo mật thông tin',
                'content' => '<p>Chúng tôi cam kết bảo mật tuyệt đối các thông tin cá nhân của quý khách mua sắm tại cửa hàng. Thông tin chỉ sử dụng cho mục đích vận đơn và CSKH.</p>',
                'meta_title' => 'Chính sách bảo mật | Thảo Mộc Kiều Sang',
                'meta_description' => 'Chính sách bảo mật thông tin khách hàng mua sắm tại website Thảo Mộc Kiều Sang.',
                'meta_keywords' => 'chinh sach bao mat, kieu sang',
                'seo_title' => 'Chính sách bảo mật | Thảo Mộc Kiều Sang',
                'seo_desc' => 'Chính sách bảo mật thông tin khách hàng mua sắm tại website Thảo Mộc Kiều Sang.',
                'status' => 'published'
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'chinh-sach-giao-hang'],
            [
                'title' => 'Chính sách giao hàng & đổi trả',
                'content' => '<p>Đồng giá giao hàng toàn quốc 30.000đ. Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển. Khách hàng được đồng kiểm hàng trước khi thanh toán.</p>',
                'meta_title' => 'Giao hàng và đổi trả | Thảo Mộc Kiều Sang',
                'meta_description' => 'Chính sách giao nhận, cước phí vận chuyển và chế độ bảo hành đổi trả hàng lỗi do vận chuyển.',
                'meta_keywords' => 'giao hang, doi tra kieu sang',
                'seo_title' => 'Giao hàng và đổi trả | Thảo Mộc Kiều Sang',
                'seo_desc' => 'Chính sách giao nhận, cước phí vận chuyển và chế độ bảo hành đổi trả hàng lỗi do vận chuyển.',
                'status' => 'published'
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'huong-dan-xong-nha-moi'],
            [
                'title' => 'Hướng dẫn xông nhà mới đúng cách',
                'content' => '<p>Đây là bài viết hướng dẫn chi tiết cách xông nhà mới mua để rước may mắn, đuổi chướng khí tồn đọng trong quá trình xây dựng...</p>',
                'meta_title' => 'Cách xông nhà mới | Phong thủy Kiều Sang',
                'meta_description' => 'Hướng dẫn chi tiết quy trình chuẩn bị và xông nhà mới đúng phong thủy rước tài lộc.',
                'meta_keywords' => 'xong nha moi, huong dan xong nha',
                'seo_title' => 'Cách xông nhà mới | Phong thủy Kiều Sang',
                'seo_desc' => 'Hướng dẫn chi tiết quy trình chuẩn bị và xông nhà mới đúng phong thủy rước tài lộc.',
                'status' => 'draft'
            ]
        );

        // 11. Create Contacts
        Contact::create([
            'name' => 'Hoàng Minh Đức',
            'email' => 'duc.hoang@example.com',
            'phone' => '0912111222',
            'subject' => 'Tư vấn trà mất ngủ',
            'message' => 'Chào shop, mình hay bị mất ngủ ban đêm và đau đầu ban ngày, nên dùng hộp trà an yên hay trà cúc vàng?',
            'status' => 'unread'
        ]);

        Contact::create([
            'name' => 'Nguyễn Thị Ngọc',
            'email' => 'ngoc.nguyen@example.com',
            'phone' => '0983123456',
            'subject' => 'Hỏi giá sỉ số lượng lớn',
            'message' => 'Mình muốn nhập sỉ 50 bó xông nhà cát tường và 30 nước xịt phòng ngải cứu vỏ cam về bán ở cửa hàng quà tặng. Có chiết khấu tốt không shop?',
            'status' => 'unread'
        ]);

        Contact::create([
            'name' => 'Lê Quốc Khánh',
            'email' => 'khanh.le@example.com',
            'phone' => '0934888999',
            'subject' => 'Đơn hàng 2 ngày chưa thấy giao',
            'message' => 'Tôi đặt đơn ORD-KS-002 thanh toán COD chưa thấy shiper gọi giao hàng, nhờ shop kiểm tra trạng thái giúp.',
            'status' => 'read'
        ]);

        Contact::create([
            'name' => 'Phạm Tuyết Mai',
            'email' => 'mai.pham@example.com',
            'phone' => '0977222333',
            'subject' => 'Góp ý chất lượng vỏ hộp trà',
            'message' => 'Trà rất thơm ngon tuyệt vời, nhưng vỏ hộp giấy bên ngoài hơi mỏng, vận chuyển xa dễ móp méo. Shop nên gia cố hộp cứng hơn.',
            'status' => 'replied'
        ]);

        Contact::create([
            'name' => 'Đỗ Văn Nam',
            'email' => 'nam.do@example.com',
            'phone' => '0904555666',
            'subject' => 'Thời gian xông nhà tốt nhất',
            'message' => 'Nhà mình chuyển về nhà mới thì nên chọn xông nhà vào sáng sớm hay chiều tối phong thủy hơn?',
            'status' => 'unread'
        ]);

        Contact::create([
            'name' => 'Nguyễn Vy Vy',
            'email' => 'vy.nguyen@example.com',
            'phone' => '0912888777',
            'subject' => 'Tinh dầu xông phòng bé sơ sinh',
            'message' => 'Bé nhà mình 5 tháng tuổi thì có đốt nhang trầm không tăm hoặc xịt tinh dầu cam ngọt được không ạ?',
            'status' => 'unread'
        ]);

        Contact::create([
            'name' => 'Trần Hồng Quân',
            'email' => 'quan.tran@example.com',
            'phone' => '0988666555',
            'subject' => 'Đế gốm bị sứt góc',
            'message' => 'Hôm qua nhận hàng kiểm tra thấy đế đốt trầm gốm men rạn bị mẻ một góc nhỏ ở viền. Nhờ shop đổi giúp đế mới.',
            'status' => 'read'
        ]);

        Contact::create([
            'name' => 'Bùi Tiến Dũng',
            'email' => 'dung.bui@example.com',
            'phone' => '0944111333',
            'subject' => 'Nhang khoanh cháy được mấy tiếng',
            'message' => 'Sản phẩm nhang khoanh đàn hương khi đốt kín phòng thì thời gian cháy thực tế khoảng mấy giờ vậy shop?',
            'status' => 'unread'
        ]);

        // 12. Create Orders and Order Items
        $p1 = Product::where('slug', 'bo-thao-moc-xong-nha')->first();
        $p2 = Product::where('slug', 'nuoc-xit-thao-moc-thanh-loc')->first();
        $p3 = Product::where('slug', 'nu-tram-thao-moc')->first();
        $p4 = Product::where('slug', 'tra-hoa-cuc-vang-tien-vua')->first();
        $p5 = Product::where('slug', 'combo-3-bo-xong-nha-cat-tuong')->first();
        $p6 = Product::where('slug', 'tinh-dau-vo-buoi-hong')->first();
        $p7 = Product::where('slug', 'de-dot-tram-gom-men-ran')->first();
        $p8 = Product::where('slug', 'hop-tra-sen-tuyet-co-thu')->first();
        $p9 = Product::where('slug', 'nhang-khoanh-dan-huong')->first();
        $p10 = Product::where('slug', 'tinh-dau-cam-ngot-nguyen-chat')->first();
        $p11 = Product::where('slug', 'bo-thao-moc-oai-huong-kho')->first();
        $p12 = Product::where('slug', 'hop-nu-tram-dac-biet-hop-go')->first();
        $p13 = Product::where('slug', 'hop-tra-thao-moc-an-yen')->first();

        // Order 1
        $o1 = Order::create([
            'order_code' => 'ORD-KS-001',
            'customer_name' => 'Nguyễn Thị Mai',
            'customer_email' => 'mai.nguyen@example.com',
            'customer_phone' => '0901234567',
            'shipping_address' => '123 Đường Láng, Đống Đa, Hà Nội',
            'notes' => 'Giao giờ hành chính, gọi trước 15 phút.',
            'total_amount' => 340000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'paid',
            'status' => 'completed'
        ]);
        if ($p1 && $p2) {
            OrderItem::create(['order_id' => $o1->id, 'product_id' => $p1->id, 'product_name' => $p1->name, 'price' => $p1->price, 'quantity' => 1]);
            OrderItem::create(['order_id' => $o1->id, 'product_id' => $p2->id, 'product_name' => $p2->name, 'price' => $p2->price, 'quantity' => 1]);
        }

        // Order 2
        $o2 = Order::create([
            'order_code' => 'ORD-KS-002',
            'customer_name' => 'Trần Anh Tuấn',
            'customer_email' => 'tuan.tran@example.com',
            'customer_phone' => '0987654321',
            'shipping_address' => 'Phòng 502 Chung cư Sunrise, Quận 7, TP HCM',
            'notes' => 'Cho kiểm hàng trước khi trả tiền.',
            'total_amount' => 360000.00,
            'payment_method' => 'COD',
            'payment_status' => 'pending',
            'status' => 'pending'
        ]);
        if ($p3) {
            OrderItem::create(['order_id' => $o2->id, 'product_id' => $p3->id, 'product_name' => $p3->name, 'price' => $p3->price, 'quantity' => 2]);
        }

        // Order 3
        $o3 = Order::create([
            'order_code' => 'ORD-KS-003',
            'customer_name' => 'Lê Thu Hà',
            'customer_email' => 'ha.le@example.com',
            'customer_phone' => '0912345678',
            'shipping_address' => '45 Hải Phòng, Quận Hải Châu, Đà Nẵng',
            'notes' => null,
            'total_amount' => 425000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'paid',
            'status' => 'processing'
        ]);
        if ($p4 && $p5) {
            OrderItem::create(['order_id' => $o3->id, 'product_id' => $p4->id, 'product_name' => $p4->name, 'price' => $p4->price, 'quantity' => 1]);
            OrderItem::create(['order_id' => $o3->id, 'product_id' => $p5->id, 'product_name' => $p5->name, 'price' => $p5->price, 'quantity' => 1]);
        }

        // Order 4
        $o4 = Order::create([
            'order_code' => 'ORD-KS-004',
            'customer_name' => 'Phạm Văn Hùng',
            'customer_email' => 'hung.pham@example.com',
            'customer_phone' => '0934567890',
            'shipping_address' => 'Kiệt 34 Nguyễn Huệ, TP Huế',
            'notes' => 'Giao gấp trong tuần.',
            'total_amount' => 190000.00,
            'payment_method' => 'COD',
            'payment_status' => 'pending',
            'status' => 'cancelled'
        ]);
        if ($p6) {
            OrderItem::create(['order_id' => $o4->id, 'product_id' => $p6->id, 'product_name' => $p6->name, 'price' => $p6->price, 'quantity' => 1]);
        }

        // Order 5
        $o5 = Order::create([
            'order_code' => 'ORD-KS-005',
            'customer_name' => 'Vũ Minh Triết',
            'customer_email' => 'triet.vu@example.com',
            'customer_phone' => '0976543210',
            'shipping_address' => '88 Lê Lợi, TP Vũng Tàu',
            'notes' => 'Giao chiều thứ 7 hoặc chủ nhật.',
            'total_amount' => 500000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'paid',
            'status' => 'completed'
        ]);
        if ($p7) {
            OrderItem::create(['order_id' => $o5->id, 'product_id' => $p7->id, 'product_name' => $p7->name, 'price' => $p7->price, 'quantity' => 2]);
        }

        // Order 6
        $o6 = Order::create([
            'order_code' => 'ORD-KS-006',
            'customer_name' => 'Nguyễn Hoàng Nam',
            'customer_email' => 'nam.nguyen@example.com',
            'customer_phone' => '0905123456',
            'shipping_address' => '15 Lê Duẩn, TP Buôn Ma Thuột, Đắk Lắk',
            'notes' => null,
            'total_amount' => 280000.00,
            'payment_method' => 'COD',
            'payment_status' => 'pending',
            'status' => 'pending'
        ]);
        if ($p8) {
            OrderItem::create(['order_id' => $o6->id, 'product_id' => $p8->id, 'product_name' => $p8->name, 'price' => $p8->price, 'quantity' => 1]);
        }

        // Order 7
        $o7 = Order::create([
            'order_code' => 'ORD-KS-007',
            'customer_name' => 'Hoàng Thu Thảo',
            'customer_email' => 'thao.hoang@example.com',
            'customer_phone' => '0989123456',
            'shipping_address' => 'Ngõ 205 Tây Sơn, Đống Đa, Hà Nội',
            'notes' => 'Không gọi giờ trưa từ 12h - 13h30.',
            'total_amount' => 455000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'paid',
            'status' => 'completed'
        ]);
        if ($p9 && $p10) {
            OrderItem::create(['order_id' => $o7->id, 'product_id' => $p9->id, 'product_name' => $p9->name, 'price' => $p9->price, 'quantity' => 1]);
            OrderItem::create(['order_id' => $o7->id, 'product_id' => $p10->id, 'product_name' => $p10->name, 'price' => $p10->price, 'quantity' => 1]);
        }

        // Order 8
        $o8 = Order::create([
            'order_code' => 'ORD-KS-008',
            'customer_name' => 'Đặng Minh Quân',
            'customer_email' => 'quan.dang@example.com',
            'customer_phone' => '0944123456',
            'shipping_address' => 'Đại học Cần Thơ, Xuân Khánh, Cần Thơ',
            'notes' => 'Giao ở cổng khoa Công nghệ thông tin.',
            'total_amount' => 300000.00,
            'payment_method' => 'COD',
            'payment_status' => 'pending',
            'status' => 'processing'
        ]);
        if ($p5) {
            OrderItem::create(['order_id' => $o8->id, 'product_id' => $p5->id, 'product_name' => $p5->name, 'price' => $p5->price, 'quantity' => 1]);
        }

        // Order 9
        $o9 = Order::create([
            'order_code' => 'ORD-KS-009',
            'customer_name' => 'Bùi Tuyết Mai',
            'customer_email' => 'mai.bui@example.com',
            'customer_phone' => '0966123456',
            'shipping_address' => '24 Trần Hưng Đạo, Hạ Long, Quảng Ninh',
            'notes' => null,
            'total_amount' => 400000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'failed',
            'status' => 'cancelled'
        ]);
        if ($p11 && $p7) {
            OrderItem::create(['order_id' => $o9->id, 'product_id' => $p11->id, 'product_name' => $p11->name, 'price' => $p11->price, 'quantity' => 1]);
            OrderItem::create(['order_id' => $o9->id, 'product_id' => $p7->id, 'product_name' => $p7->name, 'price' => $p7->price, 'quantity' => 1]);
        }

        // Order 10
        $o10 = Order::create([
            'order_code' => 'ORD-KS-010',
            'customer_name' => 'Ngô Quốc Khánh',
            'customer_email' => 'khanh.ngo@example.com',
            'customer_phone' => '0977123456',
            'shipping_address' => '102 Lê Hồng Phong, TP Vinh, Nghệ An',
            'notes' => 'Vui lòng gói bọc chống sốc kỹ.',
            'total_amount' => 490000.00,
            'payment_method' => 'VietQR',
            'payment_status' => 'paid',
            'status' => 'completed'
        ]);
        if ($p12 && $p13) {
            OrderItem::create(['order_id' => $o10->id, 'product_id' => $p12->id, 'product_name' => $p12->name, 'price' => $p12->price, 'quantity' => 1]);
            OrderItem::create(['order_id' => $o10->id, 'product_id' => $p13->id, 'product_name' => $p13->name, 'price' => $p13->price, 'quantity' => 1]);
        }

        Product::where('slug', 'bo-thao-moc-xong-nha')->update([
            'channel_one_sales' => 860,
            'channel_two_sales' => 1240,
            'virtual_sales' => 3200,
            'is_best_seller' => true,
        ]);
        Product::where('slug', 'nuoc-xit-thao-moc-thanh-loc')->update([
            'channel_one_sales' => 740,
            'channel_two_sales' => 960,
            'virtual_sales' => 2450,
            'is_best_seller' => true,
        ]);
        Product::where('slug', 'combo-3-bo-xong-nha-cat-tuong')->update([
            'channel_one_sales' => 520,
            'channel_two_sales' => 1180,
            'virtual_sales' => 1800,
            'is_best_seller' => true,
        ]);

        // 13. Create SEO Redirects
        SeoRedirect::updateOrCreate(
            ['old_url' => '/san-pham/bo-xong-nha-cu'],
            ['new_url' => '/products/bo-thao-moc-xong-nha', 'http_code' => 301, 'status' => 'active']
        );

        SeoRedirect::updateOrCreate(
            ['old_url' => '/bai-viet/huong-dan-xong-nha'],
            ['new_url' => '/blog/bi-quyet-xong-nha-tay-ue', 'http_code' => 301, 'status' => 'active']
        );

        SeoRedirect::updateOrCreate(
            ['old_url' => '/tra-thao-moc'],
            ['new_url' => '/products?category=tra-an-yen', 'http_code' => 301, 'status' => 'active']
        );

        SeoRedirect::updateOrCreate(
            ['old_url' => '/tinh-dau'],
            ['new_url' => '/products?category=thu-gian-tinh-than', 'http_code' => 302, 'status' => 'active']
        );

        SeoRedirect::updateOrCreate(
            ['old_url' => '/tam-linh-phong-thuy'],
            ['new_url' => '/blog?category=phong-thuy', 'http_code' => 301, 'status' => 'inactive']
        );

        // Auto-populate empty SEO fields for all products and blog posts
        foreach (Product::all() as $prod) {
            $prod->update([
                'seo_title' => $prod->seo_title ?? $prod->name,
                'seo_desc' => $prod->seo_desc ?? Str::limit(strip_tags($prod->description), 150),
            ]);
        }

        foreach (BlogPost::all() as $post) {
            $post->update([
                'seo_title' => $post->seo_title ?? $post->title,
                'seo_desc' => $post->seo_desc ?? Str::limit(strip_tags(implode(' ', $post->content)), 150),
            ]);
        }
    }
}
