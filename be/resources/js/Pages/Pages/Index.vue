<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    pages: Object
});

const deletePage = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa trang tĩnh này?')) {
        router.delete(route('admin.pages.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý trang tĩnh" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH TRANG TĨNH / NỘI DUNG
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Actions Bar -->
            <div class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <Link
                    :href="route('admin.pages.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm trang mới
                </Link>
            </div>

            <!-- Bordered Table -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60">Tên Trang</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-64">Đường dẫn tĩnh (Slug)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36">Trạng thái</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-40">Ngày tạo</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="page in pages.data" 
                                :key="page.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <!-- Title Column (Bold title + secondary italic details) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900 text-sm">
                                        {{ page.title }}
                                    </div>
                                    <div class="text-xs italic text-zinc-500 mt-0.5" v-if="page.meta_title">
                                        SEO: {{ page.meta_title }}
                                    </div>
                                </td>

                                <!-- Slug Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-mono text-xs text-[#043616]">
                                    /{{ page.slug }}
                                </td>

                                <!-- Status Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="page.status === 'published' 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-zinc-50 text-zinc-600 border border-zinc-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold border"
                                    >
                                        {{ page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}
                                    </span>
                                </td>

                                <!-- Created At Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-500 text-xs font-sans">
                                    {{ new Date(page.created_at).toLocaleDateString('vi-VN') }}
                                </td>

                                <!-- Actions Column -->
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.pages.edit', page.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deletePage(page.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="pages.data.length === 0">
                                <td colspan="5" class="py-8 text-center text-zinc-500">
                                    Chưa có trang tĩnh nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pages.links && pages.total > pages.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ pages.from || 0 }} đến {{ pages.to || 0 }} của {{ pages.total }} trang
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in pages.links"
                            :key="idx"
                            :href="link.url || '#'"
                            v-html="link.label"
                            :class="[
                                link.active ? 'bg-[#043616] text-[#FFFDF9] font-bold border border-[#043616]' : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200/80',
                                !link.url ? 'opacity-50 pointer-events-none' : '',
                                'px-3 py-1.5 rounded-lg text-xs transition-all duration-200'
                            ]"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
