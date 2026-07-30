<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    post: Object,
    categories: Array,
    products: Array,
    media: Array
});

const isEdit = ref(!!props.post);
const contentText = ref(props.post?.content ? props.post.content.join('\n\n') : '');

const imagePreview = ref('');
const isMediaModalOpen = ref(false);
const imageSourceType = ref(props.post?.image_path ? 'media' : 'upload');

const openMediaModal = () => {
    isMediaModalOpen.value = true;
};
const closeMediaModal = () => {
    isMediaModalOpen.value = false;
};
const selectMediaImage = (url) => {
    form.image_path = url;
    form.image = null;
    imagePreview.value = '';
    closeMediaModal();
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.image = file;
        form.image_path = '';
        imagePreview.value = URL.createObjectURL(file);
    }
};

const form = useForm({
    category_id: props.post?.category_id || '',
    title: props.post?.title || '',
    slug: props.post?.slug || '',
    excerpt: props.post?.excerpt || '',
    content: props.post?.content || [],
    image_path: props.post?.image_path || '',
    image: null,
    read_time: props.post?.read_time || '5 phút',
    status: props.post?.status || 'draft',
    published_at: props.post?.published_at ? props.post.published_at.substring(0, 10) : '',
    seo_title: props.post?.seo_title || '',
    seo_desc: props.post?.seo_desc || '',
    recommended_product_ids: props.post?.recommended_product_ids || [],
});

// Auto-generate slug from title
const generateSlug = () => {
    if (!isEdit.value) {
        form.slug = form.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
};

const submit = () => {
    // Process content text area into paragraph array
    form.content = contentText.value
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

    if (isEdit.value) {
        form.transform((data) => ({
            ...data,
            _method: 'PUT'
        })).post(route('admin.blogs.update', props.post.id));
    } else {
        form.post(route('admin.blogs.store'));
    }
};

const searchQuery = ref('');

const filteredProducts = computed(() => {
    if (!props.products) return [];
    return props.products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (p.category && p.category.name && p.category.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});

const toggleProductSelection = (productId) => {
    if (!Array.isArray(form.recommended_product_ids)) {
        form.recommended_product_ids = [];
    }
    const idx = form.recommended_product_ids.indexOf(productId);
    if (idx > -1) {
        form.recommended_product_ids.splice(idx, 1);
    } else {
        form.recommended_product_ids.push(productId);
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa bài viết' : 'Thêm bài viết'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA BÀI VIẾT' : 'THÊM BÀI VIẾT MỚI' }}
                </h2>
                <Link
                    :href="route('admin.blogs.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="max-w-4xl mx-auto space-y-6">
            <!-- Validation Errors -->
            <div v-if="Object.keys(form.errors).length > 0" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
                <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
                </ul>
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <form @submit.prevent="submit" class="p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Title -->
                        <div class="flex flex-col space-y-2 col-span-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Tiêu đề bài viết *</label>
                            <input 
                                v-model="form.title" 
                                type="text" 
                                required 
                                @input="generateSlug"
                                class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" 
                            />
                        </div>

                        <!-- Slug -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Slug (URL) *</label>
                            <input v-model="form.slug" type="text" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Category -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Danh mục bài viết *</label>
                            <select v-model="form.category_id" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="" disabled>Chọn danh mục</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                        </div>

                        <!-- Image Selection/Upload -->
                        <div class="flex flex-col space-y-2 col-span-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hình ảnh bài viết *</label>
                            
                            <div class="flex items-center gap-6 mb-2">
                                <label class="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer select-none">
                                    <input type="radio" v-model="imageSourceType" value="upload" class="text-[#043616] focus:ring-[#043616] border-zinc-300" />
                                    Tải ảnh mới từ máy tính
                                </label>
                                <label class="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer select-none">
                                    <input type="radio" v-model="imageSourceType" value="media" class="text-[#043616] focus:ring-[#043616] border-zinc-300" />
                                    Chọn ảnh từ thư viện Media
                                </label>
                            </div>

                            <div class="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                                <!-- Preview -->
                                <div v-if="imagePreview || form.image_path" class="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-white flex items-center justify-center">
                                    <img :src="imagePreview || form.image_path" alt="Xem trước" class="w-full h-full object-cover" />
                                </div>
                                <div v-else class="w-16 h-16 rounded-lg border border-dashed border-zinc-300 shrink-0 bg-white flex items-center justify-center text-zinc-400 text-xs">
                                    No Image
                                </div>

                                <!-- Upload Input -->
                                <div v-if="imageSourceType === 'upload'" class="flex-1">
                                    <input type="file" @change="handleImageChange" accept="image/*" class="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                                    <p class="text-[10px] text-zinc-400 mt-1">Định dạng hỗ trợ: JPEG, PNG, JPG, GIF, SVG, WebP. Tối đa 20MB.</p>
                                </div>

                                <!-- Media Library Button -->
                                <div v-else class="flex-1 flex items-center gap-3">
                                    <button type="button" @click="openMediaModal" class="px-4 py-2 rounded-lg border border-[#043616] text-xs font-bold text-[#043616] hover:bg-emerald-50 transition-colors">
                                        Mở thư viện Media
                                    </button>
                                    <span v-if="form.image_path" class="text-xs text-zinc-500 truncate max-w-xs" :title="form.image_path">
                                        Đã chọn: {{ form.image_path.split('/').pop() }}
                                    </span>
                                    <span v-else class="text-xs text-zinc-400">
                                        Chưa chọn ảnh nào từ thư viện Media.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Read Time -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Thời gian đọc *</label>
                            <input v-model="form.read_time" type="text" required placeholder="5 phút" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Status -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trạng thái bài viết *</label>
                            <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="draft">Bản nháp</option>
                                <option value="published">Xuất bản</option>
                            </select>
                        </div>

                        <!-- Published At -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Ngày xuất bản (để trống nếu đăng ngay)</label>
                            <input v-model="form.published_at" type="date" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>
                    </div>

                    <!-- Excerpt -->
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Tóm tắt ngắn (Excerpt) *</label>
                        <textarea v-model="form.excerpt" required rows="2" placeholder="Tóm tắt ngắn gọn nội dung bài viết..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"></textarea>
                    </div>

                    <!-- Content Editor -->
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Nội dung bài viết *</label>
                        <div class="text-xs text-zinc-500 mb-1">Mẹo: Mỗi đoạn văn cách nhau bằng 2 lần xuống dòng (phím Enter). Hệ thống tự động chuyển đổi thành các khối nội dung.</div>
                        <textarea 
                            v-model="contentText" 
                            required 
                            rows="12" 
                            placeholder="Nhập nội dung bài viết ở đây..." 
                            class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"
                        ></textarea>
                    </div>

                    <!-- Recommended Products -->
                    <div class="flex flex-col space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <label class="text-sm font-serif font-bold text-[#043616]">Sản phẩm gợi ý cho bài viết</label>
                                <div class="text-xs text-zinc-500">Chọn các sản phẩm sẽ hiển thị ở thanh bên phải của bài viết này (để trống sẽ sử dụng mặc định).</div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100/80 shrink-0">
                                    Đã chọn: {{ form.recommended_product_ids.length }} sản phẩm
                                </span>
                            </div>
                        </div>

                        <!-- Search Box -->
                        <div class="relative max-w-md">
                            <input 
                                v-model="searchQuery" 
                                type="text" 
                                placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..." 
                                class="w-full text-xs border border-zinc-200 rounded-lg pl-9 pr-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"
                            />
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                        </div>

                        <!-- Product Grid Selection -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 max-h-[320px] overflow-y-auto">
                            <div 
                                v-for="product in filteredProducts" 
                                :key="product.id"
                                @click="toggleProductSelection(product.id)"
                                :class="[
                                    'group relative flex items-center gap-3 p-3 rounded-lg border bg-white cursor-pointer select-none transition-all duration-200 hover:shadow-xs hover:border-emerald-700/40',
                                    form.recommended_product_ids.includes(product.id)
                                        ? 'border-emerald-700 ring-1 ring-emerald-700/30 bg-emerald-50/10'
                                        : 'border-zinc-200'
                                ]"
                            >
                                <!-- Checkmark indicator -->
                                <div 
                                    v-if="form.recommended_product_ids.includes(product.id)"
                                    class="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-emerald-800 text-[#FFFDF9] flex items-center justify-center shadow-xs"
                                >
                                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>

                                <!-- Image thumbnail -->
                                <div class="w-10 h-10 rounded-md bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                                    <img :src="product.image_path || '/images/logo.png'" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 min-w-0 pr-4">
                                    <p class="text-xs font-semibold text-zinc-900 truncate leading-tight mb-0.5 group-hover:text-emerald-800 transition-colors">{{ product.name }}</p>
                                    <p class="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter truncate">{{ product.category?.name || 'Thảo Mộc Xông Nhà' }}</p>
                                </div>
                            </div>
                            <div v-if="filteredProducts.length === 0" class="col-span-full py-8 text-center text-xs text-zinc-400 italic">
                                Không tìm thấy sản phẩm nào khớp với tìm kiếm.
                            </div>
                        </div>
                    </div>

                    <!-- Cấu hình SEO -->
                    <div class="border-t border-zinc-100 pt-6 space-y-4">
                        <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Cấu hình SEO cho trang</h3>
                        <div class="grid grid-cols-1 gap-4">
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Tiêu đề SEO (SEO Title)</label>
                                <input v-model="form.seo_title" type="text" placeholder="Để trống sẽ tự động lấy tiêu đề bài viết..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Mô tả SEO (SEO Meta Description)</label>
                                <textarea v-model="form.seo_desc" rows="3" placeholder="Để trống sẽ tự động trích xuất từ tóm tắt bài viết..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.blogs.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu bài viết</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>

    <!-- Media Library Selector Modal -->
    <div v-if="isMediaModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
        <div class="bg-[#FFFDF9] rounded-xl border border-zinc-200/80 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col p-6">
            <div class="flex justify-between items-center pb-4 border-b border-zinc-100">
                <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Chọn ảnh từ thư viện Media</h3>
                <button type="button" @click="closeMediaModal" class="text-zinc-400 hover:text-zinc-600 font-bold text-xl">&times;</button>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 overflow-y-auto py-6 flex-1">
                <div v-for="item in media" :key="item.id" @click="selectMediaImage(item.url)" class="group cursor-pointer border border-zinc-200 rounded-lg overflow-hidden hover:border-[#043616] hover:shadow-md transition-all duration-300">
                    <div class="aspect-square bg-zinc-50 flex items-center justify-center overflow-hidden">
                        <img :src="item.url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div class="p-2 border-t border-zinc-100 bg-white">
                        <p class="text-[10px] text-zinc-600 truncate">{{ item.original_name }}</p>
                    </div>
                </div>
                <div v-if="!media || !media.length" class="col-span-full py-12 text-center text-sm text-zinc-500">
                    Thư viện media trống. Hãy tải ảnh lên trước ở trang Media.
                </div>
            </div>
            
            <div class="flex justify-end pt-4 border-t border-zinc-100">
                <button type="button" @click="closeMediaModal" class="px-5 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">Đóng</button>
            </div>
        </div>
    </div>
</template>
