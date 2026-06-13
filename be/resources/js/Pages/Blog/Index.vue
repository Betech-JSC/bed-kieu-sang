<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    posts: Object
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
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH BÀI VIẾT
                </h2>
                <Link
                    :href="route('admin.blogs.create')"
                    class="bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    + Thêm bài viết mới
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
                                <th class="py-4 px-4">Hình ảnh</th>
                                <th class="py-4 px-4">Tiêu đề bài viết</th>
                                <th class="py-4 px-4">Danh mục</th>
                                <th class="py-4 px-4">Thời gian đọc</th>
                                <th class="py-4 px-4">Trạng thái</th>
                                <th class="py-4 px-4">Ngày xuất bản</th>
                                <th class="py-4 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="post in posts.data" 
                                :key="post.id"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4">
                                    <img :src="post.image_path" alt="Ảnh bài viết" class="w-16 h-10 rounded-lg object-cover border border-zinc-200/50" />
                                </td>
                                <td class="py-4 px-4">
                                    <div class="font-medium text-zinc-900 line-clamp-1 max-w-xs">{{ post.title }}</div>
                                    <div class="text-xs text-zinc-500 line-clamp-1 max-w-xs mt-0.5">{{ post.excerpt }}</div>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="bg-emerald-50 text-[#043616] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border border-emerald-100/50">
                                        {{ post.category?.name || 'Chưa phân loại' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-zinc-600 text-sm">
                                    {{ post.read_time }}
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-zinc-500 text-xs">
                                    {{ post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : '-' }}
                                </td>
                                <td class="py-4 px-4 text-right space-x-3">
                                    <Link :href="route('admin.blogs.edit', post.id)" class="text-[#043616] hover:text-emerald-700 font-bold text-sm">
                                        Sửa
                                    </Link>
                                    <button @click="deletePost(post.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="posts.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-400">
                                    Chưa có bài viết nào được đăng tải.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div v-if="posts.links && posts.total > posts.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
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
        </div>
    </AuthenticatedLayout>
</template>
