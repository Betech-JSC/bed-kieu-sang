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
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH BANNER / SLIDE TRANG CHỦ
                </h2>
                <Link
                    :href="route('admin.banners.create')"
                    class="bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    + Thêm banner mới
                </Link>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Notifications -->
            <div v-if="$page.props.flash?.success" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
                {{ $page.props.flash.success }}
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="p-6">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="border-b border-zinc-200 text-[#043616] font-serif text-sm font-bold">
                                <th class="py-4 px-4 w-40">Hình ảnh</th>
                                <th class="py-4 px-4">Thông tin Banner</th>
                                <th class="py-4 px-4">Đường dẫn (Link)</th>
                                <th class="py-4 px-4">Thứ tự</th>
                                <th class="py-4 px-4">Trạng thái</th>
                                <th class="py-4 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="banner in banners.data" 
                                :key="banner.id"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4">
                                    <img :src="banner.image_path" alt="Ảnh banner" class="w-32 h-16 rounded-lg object-cover border border-zinc-200/50" />
                                </td>
                                <td class="py-4 px-4">
                                    <div class="font-medium text-zinc-900">{{ banner.title || 'Chưa đặt tiêu đề' }}</div>
                                    <div class="text-xs text-zinc-500 mt-0.5">{{ banner.subtitle }}</div>
                                </td>
                                <td class="py-4 px-4 text-zinc-600 text-sm font-mono truncate max-w-xs">
                                    {{ banner.link_url || '-' }}
                                </td>
                                <td class="py-4 px-4 text-zinc-900 font-medium">
                                    {{ banner.order_index }}
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="banner.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-800'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ banner.status === 'active' ? 'Hoạt động' : 'Tạm ẩn' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-right space-x-3">
                                    <Link :href="route('admin.banners.edit', banner.id)" class="text-[#043616] hover:text-emerald-700 font-bold text-sm">
                                        Sửa
                                    </Link>
                                    <button @click="deleteBanner(banner.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="banners.data.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-400">
                                    Chưa có banner nào được khởi tạo.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div v-if="banners.links && banners.total > banners.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
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
        </div>
    </AuthenticatedLayout>
</template>
