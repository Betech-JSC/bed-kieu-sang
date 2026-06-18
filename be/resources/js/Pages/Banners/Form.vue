<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    banner: Object,
    media: Array
});

const isEdit = ref(!!props.banner);

const imagePreview = ref('');
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const form = useForm({
    title: props.banner?.title || '',
    subtitle: props.banner?.subtitle || '',
    image_path: props.banner?.image_path || '',
    image: null,
    link_url: props.banner?.link_url || '',
    page_key: props.banner?.page_key || 'home',
    position: props.banner?.position || 'hero',
    order_index: props.banner?.order_index || 0,
    status: props.banner?.status || 'active',
});

const submit = () => {
    if (isEdit.value) {
        form.transform((data) => ({
            ...data,
            _method: 'PUT'
        })).post(route('admin.banners.update', props.banner.id));
    } else {
        form.post(route('admin.banners.store'));
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa banner' : 'Thêm banner'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA BANNER' : 'TẠO BANNER SLIDE MỚI' }}
                </h2>
                <Link
                    :href="route('admin.banners.index')"
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
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Tiêu đề (Không bắt buộc)</label>
                            <input v-model="form.title" type="text" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Subtitle -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Phụ đề (Subtitle)</label>
                            <input v-model="form.subtitle" type="text" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Image Upload -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hình ảnh slide *</label>
                            <input type="file" @change="handleImageChange" accept="image/*" class="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                        </div>

                        <!-- Link URL -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Liên kết khi click (Link URL)</label>
                            <input v-model="form.link_url" type="text" placeholder="Ví dụ: /products" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trang hiển thị *</label>
                            <select v-model="form.page_key" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white">
                                <option value="home">Trang chủ</option><option value="products">Danh sách sản phẩm</option><option value="product">Chi tiết sản phẩm</option><option value="blog">Tin tức</option><option value="contact">Liên hệ</option><option value="about">Giới thiệu</option><option value="all">Tất cả trang</option>
                            </select>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Vị trí *</label>
                            <select v-model="form.position" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white">
                                <option value="hero">Hero / Slider chính</option><option value="top">Đầu nội dung</option><option value="content">Giữa nội dung</option><option value="bottom">Cuối nội dung</option>
                            </select>
                        </div>
                        <div v-if="media?.length" class="flex flex-col space-y-2 md:col-span-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hoặc chọn từ thư viện media</label>
                            <select v-model="form.image_path" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white">
                                <option value="">Không chọn</option><option v-for="item in media" :key="item.id" :value="item.url">{{ item.original_name }}</option>
                            </select>
                        </div>

                        <!-- Order Index -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Thứ tự hiển thị (càng nhỏ đứng trước) *</label>
                            <input v-model="form.order_index" type="number" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Status -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trạng thái *</label>
                            <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ẩn</option>
                            </select>
                        </div>
                    </div>

                    <!-- Image Preview -->
                    <div v-if="imagePreview || form.image_path" class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Xem trước hình ảnh</label>
                        <div class="border border-zinc-200 rounded-lg p-3 bg-zinc-50 flex justify-center items-center">
                            <img :src="imagePreview || form.image_path" alt="Xem trước ảnh banner" class="max-h-60 rounded-lg object-contain" @error="(e) => e.target.style.display='none'" />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.banners.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu banner</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
