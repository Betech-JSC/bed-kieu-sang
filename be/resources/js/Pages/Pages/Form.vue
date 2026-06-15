<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    page: Object
});

const isEdit = ref(!!props.page);

const form = useForm({
    title: props.page?.title || '',
    slug: props.page?.slug || '',
    content: props.page?.content || '',
    meta_title: props.page?.meta_title || '',
    meta_description: props.page?.meta_description || '',
    meta_keywords: props.page?.meta_keywords || '',
    seo_title: props.page?.seo_title || '',
    seo_desc: props.page?.seo_desc || '',
    status: props.page?.status || 'draft',
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
    if (isEdit.value) {
        form.put(route('admin.pages.update', props.page.id));
    } else {
        form.post(route('admin.pages.store'));
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa trang tĩnh' : 'Thêm trang tĩnh'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA TRANG TĨNH' : 'THÊM TRANG TĨNH MỚI' }}
                </h2>
                <Link
                    :href="route('admin.pages.index')"
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
                            <label class="text-sm font-serif font-bold text-emerald-950">Tiêu đề trang *</label>
                            <input v-model="form.title" type="text" required @input="generateSlug" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Slug -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Slug (URL) *</label>
                            <input v-model="form.slug" type="text" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Status -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trạng thái *</label>
                            <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="draft">Bản nháp</option>
                                <option value="published">Xuất bản</option>
                            </select>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Nội dung trang *</label>
                        <textarea v-model="form.content" required rows="10" placeholder="Nhập mã HTML hoặc nội dung văn bản của trang..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all font-mono text-sm"></textarea>
                    </div>

                    <!-- SEO Metadata -->
                    <div class="border-t border-zinc-100 pt-6 space-y-4">
                        <h3 class="text-md font-serif font-bold text-emerald-950">Cấu hình SEO Meta (Không bắt buộc)</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col space-y-2 col-span-2">
                                <label class="text-xs font-bold text-zinc-700">Tiêu đề SEO (SEO Title)</label>
                                <input v-model="form.seo_title" type="text" placeholder="Để trống sẽ tự động lấy tiêu đề trang..." class="border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm" />
                            </div>

                            <div class="flex flex-col space-y-2 col-span-2">
                                <label class="text-xs font-bold text-zinc-700">Mô tả SEO (SEO Description)</label>
                                <textarea v-model="form.seo_desc" rows="2" placeholder="Để trống sẽ tự động lấy từ nội dung trang..." class="border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm"></textarea>
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-bold text-zinc-700">Meta Title cũ (nếu có)</label>
                                <input v-model="form.meta_title" type="text" class="border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm" />
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-bold text-zinc-700">Meta Keywords</label>
                                <input v-model="form.meta_keywords" type="text" placeholder="thao moc, kieu sang, an yen" class="border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm" />
                            </div>
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="text-xs font-bold text-zinc-700">Meta Description</label>
                            <textarea v-model="form.meta_description" rows="2" class="border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm"></textarea>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.pages.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu trang tĩnh</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
