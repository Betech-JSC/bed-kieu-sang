<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    products: Object,
    categories: Array,
    filters: Object
});

const search = ref(props.filters?.search || '');
const categoryId = ref(props.filters?.category_id || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.products.index'), {
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
    // Dropdowns can trigger instantly
    router.get(route('admin.products.index'), {
        search: search.value,
        category_id: categoryId.value
    }, {
        preserveState: true,
        replace: true
    });
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
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH SẢN PHẨM THẢO MỘC
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
                        placeholder="Tìm kiếm sản phẩm..." 
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
                    :href="route('admin.products.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm mới
                </Link>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1080px] text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-20 text-center">Hình ảnh</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Thông tin sản phẩm</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-44">Giá bán</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Thông số (Specs)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Lượt bán</th>
                                <th class="w-40 min-w-40 whitespace-nowrap border-r border-zinc-200/60 px-4 py-4">Trạng thái</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="product in products.data" 
                                :key="product.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <!-- Image Column (Fixed 80px width, centered, square object-cover) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-20">
                                    <div class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200/80 mx-auto bg-zinc-50 flex items-center justify-center">
                                        <img :src="product.image_path" alt="Ảnh" class="w-full h-full object-cover" />
                                    </div>
                                </td>

                                <!-- Title Column (Bold title + secondary smaller italic text) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900 text-sm">
                                        {{ product.name }}
                                    </div>
                                    <div class="text-xs italic text-zinc-500 mt-0.5">
                                        Slug: {{ product.slug }}
                                    </div>
                                </td>

                                <!-- Price Column -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-semibold text-zinc-800">
                                    <div>{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }}</div>
                                    <div v-if="product.original_price" class="text-xs text-zinc-400 line-through font-normal">
                                        {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.original_price) }}
                                    </div>
                                </td>

                                <!-- Specs Column (Flex-wrap tags) -->
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="flex flex-wrap gap-1.5">
                                        <span class="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-medium">
                                            {{ product.category?.name || 'Chưa phân loại' }}
                                        </span>
                                        <span v-if="product.badge" class="bg-[#E5C44B]/10 text-[#604b12] border border-[#E5C44B]/30 px-2 py-0.5 rounded text-[11px] font-bold">
                                            {{ product.badge }}
                                        </span>
                                        <span class="bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5">
                                            ★ {{ product.rating }}
                                        </span>
                                        <span v-if="product.is_best_seller" class="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">
                                            Best Seller
                                        </span>
                                    </div>
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900">{{ new Intl.NumberFormat('vi-VN').format(product.total_sales || 0) }}</div>
                                    <div class="text-[11px] text-zinc-500 mt-0.5">
                                        W {{ product.channel_one_sales || 0 }} · K2 {{ product.channel_two_sales || 0 }} · A {{ product.virtual_sales || 0 }} · R {{ product.real_sales || 0 }}
                                    </div>
                                </td>

                                <!-- Status Column -->
                                <td class="w-40 min-w-40 whitespace-nowrap border-r border-zinc-200/60 px-4 py-4 align-middle">
                                    <span 
                                        :class="product.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-zinc-50 text-zinc-600 border border-zinc-200'" 
                                        class="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold leading-none"
                                    >
                                        {{ product.status === 'active' ? 'Đang bán' : 'Tạm ngưng' }}
                                    </span>
                                </td>

                                <!-- Actions Column (Width 120px, text links) -->
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.products.edit', product.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deleteProduct(product.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="products.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Không tìm thấy sản phẩm nào phù hợp.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="products.links && products.total > products.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
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
    </AuthenticatedLayout>
</template>
