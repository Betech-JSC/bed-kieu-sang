<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    redirects: Object
});

const deleteRedirect = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa cấu hình chuyển hướng này?')) {
        router.delete(route('admin.seo-redirects.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý SEO Redirects" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    QUẢN LÝ SEO REDIRECTS (ĐIỀU HƯỚNG URL)
                </h2>
                <Link
                    :href="route('admin.seo-redirects.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm chuyển hướng mới
                </Link>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-1/3">URL cũ (Source URL)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-1/3">URL mới (Target URL)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28">Mã HTTP</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Trạng thái</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="item in redirects.data" 
                                :key="item.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 font-mono text-xs text-zinc-950 truncate max-w-xs align-middle" :title="item.old_url">
                                    {{ item.old_url }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 font-mono text-xs text-[#043616] truncate max-w-xs align-middle" :title="item.new_url">
                                    {{ item.new_url }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 font-mono text-sm font-bold align-middle">
                                    {{ item.http_code }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="item.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                            : 'bg-zinc-50 text-zinc-750 border-zinc-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ item.status === 'active' ? 'Hoạt động' : 'Tạm ẩn' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.seo-redirects.edit', item.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deleteRedirect(item.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="redirects.data.length === 0">
                                <td colspan="5" class="py-8 text-center text-zinc-500">
                                    Không có URL chuyển hướng nào được cấu hình.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="redirects.links && redirects.total > redirects.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ redirects.from || 0 }} đến {{ redirects.to || 0 }} của {{ redirects.total }} chuyển hướng
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in redirects.links"
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

