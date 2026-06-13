<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    products: Object
});

const deleteProduct = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        router.delete(route('admin.products.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý sản phẩm" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH SẢN PHẨM THẢO MỘC
                </h2>
                <Link
                    :href="route('admin.products.create')"
                    class="bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    + Thêm sản phẩm mới
                </Link>
            </div>
        </template>

        <div class="space-y-6">
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="p-6">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="border-b border-zinc-200 text-[#043616] font-serif text-sm font-bold">
                                <th class="py-4 px-4">Hình ảnh</th>
                                <th class="py-4 px-4">Tên sản phẩm</th>
                                <th class="py-4 px-4">Giá bán</th>
                                <th class="py-4 px-4">Đánh giá</th>
                                <th class="py-4 px-4">Trạng thái</th>
                                <th class="py-4 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="product in products.data" 
                                :key="product.id"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4">
                                    <img :src="product.image_path" alt="Ảnh sản phẩm" class="w-12 h-12 rounded-lg object-cover border border-zinc-200/60" />
                                </td>
                                <td class="py-4 px-4 font-medium text-zinc-900">
                                    {{ product.name }}
                                    <span v-if="product.badge" class="ml-2 bg-[#E5C44B]/20 text-[#604b12] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {{ product.badge }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-zinc-700 font-sans">
                                    {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }}
                                </td>
                                <td class="py-4 px-4 text-amber-500">
                                    ★ {{ product.rating }}
                                </td>
                                <td class="py-4 px-4">
                                    <span :class="product.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-800'" class="px-3 py-1 rounded-full text-xs font-semibold">
                                        {{ product.status === 'active' ? 'Đang bán' : 'Nháp' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-right space-x-3">
                                    <Link :href="route('admin.products.edit', product.id)" class="text-[#043616] hover:text-emerald-700 font-bold text-sm">
                                        Sửa
                                    </Link>
                                    <button @click="deleteProduct(product.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div v-if="products.links && products.total > products.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
                        <div class="text-xs text-zinc-500">
                            Hiển thị từ {{ products.from || 0 }} đến {{ products.to || 0 }} của {{ products.total }} sản phẩm
                        </div>
                        <div class="flex gap-1">
                            <Link
                                v-for="(link, idx) in products.links"
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
