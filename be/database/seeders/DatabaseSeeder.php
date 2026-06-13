<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@kieusang.vn'],
            [
                'name' => 'Kiều Sang Admin',
                'password' => Hash::make('admin123'),
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
    }
}
