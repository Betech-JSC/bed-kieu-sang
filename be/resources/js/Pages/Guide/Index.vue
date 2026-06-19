<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

const activeTab = ref('start');

const tabs = [
    { id: 'start', label: 'Bắt đầu' },
    { id: 'content', label: 'Nội dung & Sản phẩm' },
    { id: 'customers', label: 'Đơn hàng & Khách hàng' },
    { id: 'system', label: 'SEO & Hệ thống' },
];

const sections = {
    start: [
        {
            title: 'Quy trình vận hành hằng ngày',
            description: 'Thứ tự đề xuất giúp dữ liệu bán hàng và nội dung website luôn được cập nhật.',
            steps: [
                'Kiểm tra Tổng quan để nắm số đơn hàng, liên hệ mới và hoạt động gần đây.',
                'Mở Đơn đặt hàng, xác nhận thông tin khách và cập nhật trạng thái xử lý, thanh toán.',
                'Kiểm tra Hộp thư liên hệ và phản hồi khách qua email hoặc số điện thoại đã cung cấp.',
                'Duyệt đánh giá mới trước khi cho phép hiển thị công khai trên website.',
                'Kiểm tra sản phẩm, giá bán, banner và bài viết cần cập nhật trong ngày.',
            ],
        },
        {
            title: 'Nguyên tắc xuất bản an toàn',
            description: 'Kiểm tra nội dung trước khi đưa lên website để tránh lỗi hiển thị và đường dẫn.',
            items: [
                'Tạo danh mục trước khi tạo sản phẩm; dùng tên và slug ngắn, rõ nghĩa.',
                'Tối ưu ảnh trước khi tải lên, kiểm tra ảnh xem trước và nội dung trên mobile.',
                'Lưu bài viết ở trạng thái Bản nháp trong lúc biên tập, chỉ chọn Xuất bản khi đã rà soát.',
                'Không đổi slug của trang đang có lượt truy cập nếu chưa tạo SEO Redirect từ URL cũ.',
                'Không chia sẻ tài khoản; quản trị viên nên cấp đúng quyền cho từng nhân viên.',
            ],
        },
        {
            title: 'Phân quyền tài khoản',
            description: 'Mục hiển thị và thao tác chỉnh sửa phụ thuộc vào quyền của tài khoản đang đăng nhập.',
            items: [
                'Super Admin có toàn quyền quản trị hệ thống.',
                'Nhân viên chỉ nhìn thấy hoặc chỉnh sửa các module đã được cấp quyền.',
                'Trang Hướng dẫn sử dụng luôn khả dụng với mọi tài khoản đã đăng nhập và xác minh.',
                'Khi không thấy nút Tạo, Sửa hoặc Xóa, hãy liên hệ Super Admin để kiểm tra quyền.',
            ],
        },
    ],
    content: [
        {
            title: 'Hiển thị sản phẩm trên trang chủ',
            description: 'Thiết lập trường Nhãn (Badge) trong CMS để sản phẩm xuất hiện đúng khu vực trên trang chủ.',
            steps: [
                'Mở Sản phẩm, tạo mới hoặc chọn Sửa tại sản phẩm cần hiển thị; bảo đảm Trạng thái đang là Hoạt động.',
                'Để hiển thị trong “Sản Phẩm Mới – SỰ KHỞI ĐẦU MỚI”, nhập chính xác NEW (viết hoa, không có khoảng trắng) vào trường Nhãn.',
                'Để hiển thị trong “Ưu Đãi Lành Mạnh – KHUYẾN MÃI ĐẶC BIỆT”, nhập một nhãn khác NEW, ví dụ -15%, SALE hoặc HOT; nên nhập thêm Giá gốc lớn hơn Giá bán.',
                'Để hiển thị trong “Sản Phẩm Nổi Bật – BỘ SƯU TẬP THẢO MỘC”, để trống hoàn toàn trường Nhãn.',
                'Lưu sản phẩm rồi tải lại trang chủ để kiểm tra. Nếu nhóm Sản phẩm mới hoặc Khuyến mãi không có sản phẩm phù hợp, toàn bộ khu vực đó sẽ tự động được ẩn.',
            ],
        },
        {
            title: 'Danh mục & Sản phẩm',
            description: 'Quản lý thông tin bán hàng chính hiển thị trên website.',
            items: [
                'Tạo Danh mục trước, sau đó thêm sản phẩm và chọn đúng danh mục.',
                'Nhập tên, slug, giá bán, giá gốc, ảnh, mô tả, lợi ích và trạng thái kinh doanh.',
                'Giá gốc chỉ dùng khi cần hiển thị mức giá trước giảm; nhãn có thể dùng cho NEW hoặc phần trăm ưu đãi.',
                'Trạng thái Tạm ngưng / Nháp giúp ẩn sản phẩm khỏi luồng bán mà không xóa dữ liệu.',
                'Tiêu đề và mô tả SEO có thể để trống để hệ thống lấy từ tên và mô tả sản phẩm.',
            ],
        },
        {
            title: 'Tạo phân loại / biến thể sản phẩm',
            description: 'Tạo các lựa chọn bán hàng như Gói tiêu chuẩn, Gói lớn, Combo hoặc dung tích khác nhau; mỗi phân loại có giá và hình ảnh riêng.',
            steps: [
                'Mở Sản phẩm, chọn Thêm sản phẩm hoặc Sửa sản phẩm đã có. Khu vực Phân loại sản phẩm luôn được bật sẵn trong biểu mẫu.',
                'Nhấn “Thêm phân loại”. Nhập tên dễ hiểu với khách hàng, ví dụ Gói tiêu chuẩn, Chai 250 ml hoặc Hộp 20 túi lọc.',
                'Nhập SKU riêng và không trùng với phân loại khác. Nên dùng mã ngắn, viết hoa, ví dụ NXTM-250ML hoặc HTAY-HOP-20.',
                'Nhập Giá bán. Nếu đang giảm giá, nhập thêm Giá gốc lớn hơn Giá bán; website sẽ tự hiển thị giá gạch ngang và số tiền tiết kiệm.',
                'Nhập Tồn kho và chọn trạng thái Đang bán. Phân loại hết hàng có thể để tồn kho bằng 0; chọn Tạm ẩn nếu chưa muốn khách nhìn thấy.',
                'Tải Ảnh riêng cho phân loại. Ảnh này được thêm vào thư viện ảnh trang sản phẩm và tự động hiển thị khi khách chọn đúng phân loại.',
                'Lặp lại thao tác Thêm phân loại cho các lựa chọn còn lại, sau đó nhấn Lưu sản phẩm. Giá ngoài danh sách sản phẩm tự lấy mức thấp nhất trong các phân loại đang bán.',
                'Mở trang chi tiết sản phẩm ngoài website, chọn lần lượt từng phân loại và kiểm tra ảnh, giá bán, giá gốc cùng trạng thái tồn kho trước khi bắt đầu nhận đơn.',
            ],
        },
        {
            title: 'Lượt bán đa kênh & Sản phẩm bán chạy',
            description: 'Kiểm soát số lượt bán hiển thị và danh sách sản phẩm cần ưu tiên.',
            items: [
                'Tổng lượt bán hiển thị được cộng từ Kênh 1, Kênh 2, Số bán cấu hình và Đơn hàng hệ thống.',
                'Kênh 1 và Kênh 2 dùng để nhập doanh số từ website, sàn thương mại điện tử hoặc cửa hàng.',
                'Số bán cấu hình là số bổ sung do quản trị viên nhập; không thay đổi dữ liệu đơn hàng thật.',
                'Đánh dấu Ghim vào Sản Phẩm Bán Chạy để sản phẩm xuất hiện trong khu vực bán chạy trên website.',
                'Không xóa sản phẩm đã phát sinh đơn hàng; chuyển sang Tạm ngưng để giữ lịch sử dữ liệu.',
            ],
        },
        {
            title: 'Banner, Bài viết & Trang tĩnh',
            description: 'Cập nhật nội dung truyền thông và thông tin dài hạn của website.',
            items: [
                'Banner / Slide cho phép chọn trang hiển thị, vị trí, liên kết, thứ tự và trạng thái.',
                'Bài viết hỗ trợ Bản nháp và Xuất bản; có thể đặt ngày xuất bản và cấu hình SEO riêng.',
                'Trang tĩnh dùng cho nội dung ít thay đổi như giới thiệu, chính sách hoặc nội dung liên hệ.',
                'Slug phải viết thường, không dấu, dùng dấu gạch ngang và không trùng với nội dung khác.',
                'Sau khi cập nhật, mở website ở tab riêng để kiểm tra ảnh, nội dung và đường dẫn thực tế.',
            ],
        },
        {
            title: 'Thư viện media',
            description: 'Lưu và tái sử dụng hình ảnh trên toàn hệ thống.',
            items: [
                'Có thể tải tối đa 10 ảnh mỗi lần, dung lượng tối đa 5 MB mỗi ảnh.',
                'Nhập mô tả ảnh để hỗ trợ SEO và khả năng tiếp cận.',
                'Dùng Sao chép URL hoặc chọn trực tiếp ảnh thư viện trong form banner.',
                'Chỉ xóa ảnh sau khi chắc chắn ảnh không còn được sản phẩm, bài viết hoặc banner sử dụng.',
            ],
        },
    ],
    customers: [
        {
            title: 'Xử lý đơn đặt hàng',
            description: 'Mọi đơn hợp lệ từ website được lưu và hiển thị trong mục Đơn đặt hàng.',
            steps: [
                'Mở đơn mới ở trạng thái Chờ xử lý và kiểm tra khách hàng, số điện thoại, địa chỉ, sản phẩm và ghi chú.',
                'Xác nhận đơn với khách, sau đó chuyển trạng thái sang Đang xử lý.',
                'Cập nhật thanh toán thành Đã thanh toán khi đã nhận tiền; giữ Chờ thanh toán đối với đơn COD chưa giao.',
                'Chỉ chuyển Hoàn thành khi đơn đã giao thành công; dùng Đã hủy cho đơn không tiếp tục xử lý.',
                'Nếu đơn trên website không xuất hiện trong CMS, kiểm tra API đơn hàng và cấu hình database production trước khi nhập lại.',
            ],
        },
        {
            title: 'Hộp thư liên hệ',
            description: 'Lưu các yêu cầu khách gửi từ biểu mẫu liên hệ trên website.',
            items: [
                'Mở từng liên hệ để xem đầy đủ họ tên, email, số điện thoại, chủ đề và lời nhắn.',
                'Phản hồi qua đúng kênh khách đã cung cấp và ghi nhận kết quả theo quy trình nội bộ.',
                'Chỉ xóa thư rác hoặc bản ghi không còn giá trị; dữ liệu đã xóa không dùng để đối soát sau này.',
            ],
        },
        {
            title: 'Đánh giá khách hàng',
            description: 'Duyệt nội dung trước khi đánh giá được hiển thị công khai.',
            items: [
                'Đánh giá mới ở trạng thái Chờ duyệt và chưa hiển thị trên website.',
                'Chọn Duyệt với đánh giá phù hợp hoặc Từ chối nếu nội dung sai lệch, spam hay không liên quan.',
                'Có thể đánh dấu đánh giá nổi bật để ưu tiên hiển thị ở các vị trí truyền thông.',
                'Không chỉnh sửa ý nghĩa nhận xét của khách; chỉ kiểm duyệt theo tiêu chuẩn nội dung.',
            ],
        },
        {
            title: 'FAQ & Hỏi đáp sản phẩm',
            description: 'Quản lý nội dung hỗ trợ khách hàng trước và sau khi mua.',
            items: [
                'FAQ dùng cho câu hỏi chung; đặt trạng thái Hiển thị để xuất hiện tại trang FAQ trên website.',
                'Câu hỏi sản phẩm do khách gửi luôn ở trạng thái Chờ xử lý.',
                'Nhập câu trả lời và chọn Duyệt công khai để hiển thị tại trang chi tiết sản phẩm.',
                'Từ chối hoặc xóa câu hỏi spam, sai chủ đề hay chứa nội dung không phù hợp.',
            ],
        },
    ],
    system: [
        {
            title: 'Cấu hình chung & Số liệu uy tín',
            description: 'Thiết lập thông tin dùng chung trên website mà không cần chỉnh mã nguồn.',
            items: [
                'Cập nhật hotline, email và địa chỉ cửa hàng để đồng bộ khu vực liên hệ và chân trang.',
                'Số sản phẩm đã bán và điểm đánh giá được dùng cho khu vực Số liệu uy tín trên trang chủ.',
                'Meta Title, Meta Description và Meta Keywords là cấu hình SEO mặc định toàn website.',
                'Sau khi lưu, kiểm tra website công khai để chắc chắn dữ liệu mới đã được API trả về.',
            ],
        },
        {
            title: 'SEO Redirects',
            description: 'Giữ người dùng và công cụ tìm kiếm không gặp lỗi khi URL thay đổi.',
            steps: [
                'Nhập đường dẫn cũ bắt đầu bằng dấu /, ví dụ /products/ten-cu.',
                'Nhập đường dẫn mới đang hoạt động, ví dụ /products/ten-moi.',
                'Chọn mã 301 cho thay đổi vĩnh viễn; chỉ dùng mã khác khi có yêu cầu kỹ thuật cụ thể.',
                'Lưu redirect rồi mở URL cũ trong cửa sổ riêng để kiểm tra điểm đến.',
            ],
        },
        {
            title: 'Người dùng, Vai trò & Lịch sử hoạt động',
            description: 'Kiểm soát quyền truy cập và truy vết các thay đổi quan trọng trong CMS.',
            items: [
                'Tạo vai trò, chọn các quyền theo module rồi gán vai trò đó cho từng tài khoản.',
                'Tạo tài khoản riêng cho từng nhân viên và chỉ cấp các quyền cần cho công việc.',
                'Thu hồi hoặc khóa quyền khi nhân viên không còn phụ trách hệ thống.',
                'Dùng Lịch sử hoạt động để kiểm tra ai đã tạo, cập nhật hoặc xóa dữ liệu và vào thời điểm nào.',
                'Không thay đổi dữ liệu trực tiếp trong database production nếu thao tác tương ứng đã có trong CMS.',
            ],
        },
    ],
};
</script>

<template>
    <Head title="Hướng dẫn sử dụng - Xông Nhà Tẩy Uế CMS" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950">
                Hướng dẫn sử dụng
            </h2>
        </template>

        <div class="mx-auto max-w-5xl space-y-6 pb-8">
            <section class="overflow-hidden rounded-lg border border-emerald-900/20 bg-[#043616] px-6 py-7 text-[#FFFDF9] sm:px-8">
                <p class="text-xs font-bold uppercase tracking-wider text-[#E5C44B]">Tài liệu quản trị viên</p>
                <h1 class="mt-2 text-2xl font-bold sm:text-3xl">CMS Xông Nhà Tẩy Uế</h1>
                <p class="mt-3 max-w-3xl text-sm leading-6 text-[#FAF6EE]/80">
                    Hướng dẫn quản lý nội dung, sản phẩm, đơn hàng và cấu hình website. Chọn nhóm chức năng bên dưới để tra cứu quy trình cần thực hiện.
                </p>
            </section>

            <div class="overflow-x-auto border-b border-zinc-200" role="tablist" aria-label="Nhóm hướng dẫn">
                <div class="flex min-w-max gap-1">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        type="button"
                        role="tab"
                        :aria-selected="activeTab === tab.id"
                        :class="[
                            activeTab === tab.id
                                ? 'border-[#043616] bg-emerald-50 text-[#043616]'
                                : 'border-transparent text-zinc-600 hover:bg-white hover:text-zinc-900',
                            'border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                        ]"
                        @click="activeTab = tab.id"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div class="overflow-hidden rounded-lg border border-zinc-200/80 bg-[#FFFDF9] px-5 sm:px-8">
                <section
                    v-for="(section, sectionIndex) in sections[activeTab]"
                    :key="section.title"
                    class="grid gap-5 border-b border-zinc-200/70 py-7 last:border-b-0 lg:grid-cols-[220px_1fr] lg:gap-10"
                >
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            {{ String(sectionIndex + 1).padStart(2, '0') }}
                        </p>
                        <h2 class="mt-2 text-lg font-bold leading-6 text-emerald-950">{{ section.title }}</h2>
                        <p class="mt-2 text-sm leading-6 text-zinc-500">{{ section.description }}</p>
                    </div>

                    <ol v-if="section.steps" class="space-y-3">
                        <li v-for="(step, index) in section.steps" :key="step" class="flex gap-3 text-sm leading-6 text-zinc-700">
                            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                                {{ index + 1 }}
                            </span>
                            <span>{{ step }}</span>
                        </li>
                    </ol>

                    <ul v-else class="space-y-3">
                        <li v-for="item in section.items" :key="item" class="flex gap-3 text-sm leading-6 text-zinc-700">
                            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5C44B]"></span>
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </section>
            </div>

            <p class="text-center text-xs leading-5 text-zinc-500">
                Tài liệu dành cho hệ thống Xông Nhà Tẩy Uế. Khi gặp lỗi dữ liệu hoặc cần thay đổi chức năng, hãy ghi lại đường dẫn, thao tác và ảnh chụp màn hình để bộ phận kỹ thuật kiểm tra.
            </p>
        </div>
    </AuthenticatedLayout>
</template>
