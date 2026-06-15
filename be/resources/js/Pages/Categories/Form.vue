<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    category: Object
});

const isEdit = ref(!!props.category);

const form = useForm({
    name: props.category?.name || '',
    slug: props.category?.slug || '',
    type: props.category?.type || 'product',
});

// Auto-generate slug from name
const generateSlug = () => {
    if (!isEdit.value) {
        form.slug = form.name
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
        form.put(route('admin.categories.update', props.category.id));
    } else {
        form.post(route('admin.categories.store'));
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa danh mục' : 'Thêm danh mục'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA DANH MỤC' : 'TẠO DANH MỤC MỚI' }}
                </h2>
                <Link
                    :href="route('admin.categories.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="max-w-xl mx-auto space-y-6">
            <!-- Validation Errors -->
            <div v-if="Object.keys(form.errors).length > 0" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
                <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
                </ul>
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <form @submit.prevent="submit" class="p-8 space-y-6">
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Tên danh mục *</label>
                        <input v-model="form.name" type="text" required @input="generateSlug" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Slug (URL) *</label>
                        <input v-model="form.slug" type="text" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Loại danh mục *</label>
                        <select v-model="form.type" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                            <option value="product">Sản phẩm</option>
                            <option value="blog">Bài viết (Blogs)</option>
                        </select>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.categories.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu danh mục</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
