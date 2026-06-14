<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    redirect: Object
});

const isEdit = ref(!!props.redirect);

const form = useForm({
    old_url: props.redirect?.old_url || '',
    new_url: props.redirect?.new_url || '',
    http_code: props.redirect?.http_code || 301,
    status: props.redirect?.status || 'active',
});

const submit = () => {
    if (isEdit.value) {
        form.put(route('admin.seo-redirects.update', props.redirect.id));
    } else {
        form.post(route('admin.seo-redirects.store'));
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa Redirect' : 'Thêm Redirect'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA SEO REDIRECT' : 'TẠO SEO REDIRECT MỚI' }}
                </h2>
                <Link
                    :href="route('admin.seo-redirects.index')"
                    class="text-zinc-650 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="max-w-4xl mx-auto space-y-6">
            <!-- Validation Errors -->
            <div v-if="Object.keys(form.errors).length > 0" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-bold">
                <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
                </ul>
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <form @submit.prevent="submit" class="p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Old URL -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Đường dẫn cũ (Source URL) *</label>
                            <input v-model="form.old_url" type="text" required placeholder="/tin-tuc-cu" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all font-mono text-sm" />
                            <span class="text-xs text-zinc-400">Ví dụ: /san-pham/bo-xong-cu</span>
                        </div>

                        <!-- New URL -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Đường dẫn mới (Target URL) *</label>
                            <input v-model="form.new_url" type="text" required placeholder="/products/bo-thao-moc-xong-nha" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all font-mono text-sm" />
                            <span class="text-xs text-zinc-400">Có thể nhập tương đối /products hoặc tuyệt đối https://...</span>
                        </div>

                        <!-- HTTP Code -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Mã chuyển hướng HTTP *</label>
                            <select v-model="form.http_code" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm">
                                <option :value="301">301 - Chuyển hướng vĩnh viễn (Permanent)</option>
                                <option :value="302">302 - Chuyển hướng tạm thời (Temporary)</option>
                            </select>
                        </div>

                        <!-- Status -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trạng thái *</label>
                            <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm">
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ẩn</option>
                            </select>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-150">
                        <Link :href="route('admin.seo-redirects.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-650 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-bold hover:bg-[#112215] transition-all disabled:opacity-50 hover:shadow-sm">Lưu Redirect</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
