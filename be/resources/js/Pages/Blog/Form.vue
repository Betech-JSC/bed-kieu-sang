<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';

const props = defineProps({
    post: Object,
    categories: Array
});

const isEdit = ref(!!props.post);
const contentText = ref(props.post?.content ? props.post.content.join('\n\n') : '');

const imagePreview = ref('');
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.image = file;
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

                        <!-- Image Upload -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hình ảnh bài viết *</label>
                            <div class="flex items-center gap-4">
                                <div v-if="imagePreview || form.image_path" class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                    <img :src="imagePreview || form.image_path" alt="Xem trước" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1">
                                    <input type="file" @change="handleImageChange" accept="image/*" class="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
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

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.blogs.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu bài viết</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
