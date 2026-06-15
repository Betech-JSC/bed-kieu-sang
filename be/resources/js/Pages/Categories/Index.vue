<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    categories: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const type = ref(props.filters?.type || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.categories.index'), {
            search: search.value,
            type: type.value
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);
};

watch(search, handleFilterChange);
watch(type, () => {
    router.get(route('admin.categories.index'), {
        search: search.value,
        type: type.value
    }, {
        preserveState: true,
        replace: true
    });
});

const deleteCategory = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        router.delete(route('admin.categories.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý danh mục" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH DANH MỤC
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Filters & Actions Bar -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <!-- Left: Filters -->
                <div class="flex flex-wrap items-center gap-3">
                    <input 
                        v-model="search" 
                        type="text" 
                        placeholder="Tìm kiếm danh mục..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="type" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="product">Sản phẩm</option>
                        <option value="blog">Bài viết (Blogs)</option>
                    </select>
                </div>

                <!-- Right: Action Button -->
                <Link
                    v-if="$page.props.auth.user.role === 'super_admin' || $page.props.auth.user.permissions.includes('manage_categories')"
                    :href="route('admin.categories.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm danh mục mới
                </Link>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-16 text-center">ID</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Tên danh mục</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Slug (URL)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-44">Loại danh mục</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="category in categories.data" 
                                :key="category.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-16 text-zinc-500 font-mono">
                                    {{ category.id }}
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-bold text-zinc-900">
                                    {{ category.name }}
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-500 font-mono text-xs">
                                    {{ category.slug }}
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="category.type === 'product' 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-amber-50 text-amber-800 border border-amber-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold border"
                                    >
                                        {{ category.type === 'product' ? 'Sản phẩm' : 'Bài viết (Blogs)' }}
                                    </span>
                                </td>

                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div 
                                        v-if="$page.props.auth.user.role === 'super_admin' || $page.props.auth.user.permissions.includes('manage_categories')"
                                        class="flex items-center justify-center gap-3"
                                    >
                                        <Link :href="route('admin.categories.edit', category.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deleteCategory(category.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                    <span v-else class="text-xs text-zinc-400 italic">Không có quyền</span>
                                </td>
                            </tr>
                            <tr v-if="categories.data.length === 0">
                                <td colspan="5" class="py-8 text-center text-zinc-500">
                                    Không tìm thấy danh mục nào phù hợp.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="categories.links && categories.total > categories.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ categories.from || 0 }} đến {{ categories.to || 0 }} của {{ categories.total }} danh mục
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in categories.links"
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
