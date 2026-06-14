<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    posts: Object,
    categories: Array,
    filters: Object
});

const search = ref(props.filters?.search || '');
const categoryId = ref(props.filters?.category_id || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.blogs.index'), {
            search: search.value,
            category_id: categoryId.value
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);
};

watch(search, handleFilterChange);
watch(categoryId, () => {
    router.get(route('admin.blogs.index'), {
        search: search.value,
        category_id: categoryId.value
    }, {
        preserveState: true,
        replace: true
    });
});

const deletePost = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        router.delete(route('admin.blogs.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý bài viết" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH BÀI VIẾT TIN TỨC
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
                        placeholder="Tìm kiếm bài viết..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="categoryId" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả danh mục</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                </div>

                <!-- Right: Action Button -->
                <Link
                    :href="route('admin.blogs.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm bài viết mới
                </Link>
            </div>

            <!-- Bordered Table -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-24 text-center">Hình ảnh</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Tiêu đề bài viết</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36 text-center">Thông số (Specs)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36">Trạng thái</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-40">Ngày xuất bản</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="post in posts.data" 
                                :key="post.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <!-- Image Column (Fixed w-20, square object-cover) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-24">
                                    <div class="w-16 h-10 rounded overflow-hidden border border-zinc-200/80 mx-auto bg-zinc-50 flex items-center justify-center">
                                        <img :src="post.image_path" alt="Ảnh" class="w-full h-full object-cover" />
                                    </div>
                                </td>

                                <!-- Title Column (Bold title + secondary italic text) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900 text-sm line-clamp-1">
                                        {{ post.title }}
                                    </div>
                                    <div class="text-xs italic text-zinc-500 line-clamp-1 mt-0.5">
                                        {{ post.excerpt }}
                                    </div>
                                </td>

                                <!-- Specs Column (Tags) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center">
                                    <div class="flex flex-wrap justify-center gap-1">
                                        <span class="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-medium">
                                            {{ post.category?.name || 'Chưa phân loại' }}
                                        </span>
                                        <span class="bg-zinc-50 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded text-[11px] font-medium">
                                            {{ post.read_time }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Status Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="post.status === 'published' 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-zinc-50 text-zinc-600 border border-zinc-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold border"
                                    >
                                        {{ post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}
                                    </span>
                                </td>

                                <!-- Published At Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-500 text-xs font-sans">
                                    {{ post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : '-' }}
                                </td>

                                <!-- Actions Column -->
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.blogs.edit', post.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deletePost(post.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="posts.data.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-500">
                                    Không tìm thấy bài viết nào phù hợp.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="posts.links && posts.total > posts.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ posts.from || 0 }} đến {{ posts.to || 0 }} của {{ posts.total }} bài viết
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in posts.links"
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
