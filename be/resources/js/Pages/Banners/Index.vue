<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    banners: Object
});

const deleteBanner = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
        router.delete(route('admin.banners.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý banner" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH BANNER / SLIDE THEO TRANG
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Actions Bar -->
            <div class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <Link
                    :href="route('admin.banners.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm banner mới
                </Link>
            </div>

            <!-- Bordered Table -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32 text-center">Hình ảnh</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Thông tin Banner</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Đường dẫn (Link)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Vị trí</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28 text-center">Thông số</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36">Trạng thái</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="banner in banners.data" 
                                :key="banner.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <!-- Image Column (Fixed centered width, object-cover) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-32">
                                    <div class="w-24 h-12 rounded overflow-hidden border border-zinc-200/80 mx-auto bg-zinc-50 flex items-center justify-center">
                                        <img :src="banner.image_path" alt="Ảnh banner" class="w-full h-full object-cover" />
                                    </div>
                                </td>

                                <!-- Title/Info Column (Bold title + secondary italic text) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900 text-sm">
                                        {{ banner.title || 'Chưa đặt tiêu đề' }}
                                    </div>
                                    <div class="text-xs italic text-zinc-500 mt-0.5">
                                        {{ banner.subtitle || 'Không có phụ đề' }}
                                    </div>
                                </td>

                                <!-- Link Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-mono text-xs text-zinc-500 max-w-xs truncate">
                                    {{ banner.link_url || '-' }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 text-xs"><strong>{{ banner.page_key }}</strong><div class="text-zinc-500">{{ banner.position }}</div></td>

                                <!-- Order Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-28 font-medium">
                                    <span class="bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded text-xs font-semibold">
                                        Mức: {{ banner.order_index }}
                                    </span>
                                </td>

                                <!-- Status Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="banner.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-zinc-50 text-zinc-600 border border-zinc-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold border"
                                    >
                                        {{ banner.status === 'active' ? 'Hoạt động' : 'Tạm ẩn' }}
                                    </span>
                                </td>

                                <!-- Actions Column -->
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.banners.edit', banner.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deleteBanner(banner.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="banners.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Chưa có banner nào được tạo.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="banners.links && banners.total > banners.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ banners.from || 0 }} đến {{ banners.to || 0 }} của {{ banners.total }} banner
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in banners.links"
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
