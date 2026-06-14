<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    testimonials: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.testimonials.index'), {
            search: search.value,
            status: status.value
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);
};

watch(search, handleFilterChange);
watch(status, () => {
    router.get(route('admin.testimonials.index'), {
        search: search.value,
        status: status.value
    }, {
        preserveState: true,
        replace: true
    });
});

const updateStatus = (id, status, isFeatured = false) => {
    router.patch(route('admin.testimonials.status', id), {
        status: status,
        is_featured: isFeatured
    });
};

const toggleFeatured = (testimonial) => {
    router.patch(route('admin.testimonials.status', testimonial.id), {
        status: testimonial.status,
        is_featured: !testimonial.is_featured
    });
};
</script>

<template>
    <Head title="Quản lý đánh giá" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    QUẢN LÝ ĐÁNH GIÁ & NHẬN XÉT
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Filters & Search Bar -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <div class="flex flex-wrap items-center gap-3">
                    <input 
                        v-model="search" 
                        type="text" 
                        placeholder="Tìm kiếm nhận xét..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="status" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                    </select>
                </div>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-56">Khách hàng</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-48">Sản phẩm</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-24">Đánh giá</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Nội dung nhận xét</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28">Nổi bật</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Trạng thái</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="item in testimonials.data" 
                                :key="item.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                            <img :src="item.customer_avatar || 'https://www.gravatar.com/avatar/?d=mp'" alt="Avatar" class="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div class="font-bold text-zinc-900 text-sm leading-tight">{{ item.customer_name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-medium text-zinc-700">
                                    {{ item.product?.name || 'Đánh giá chung' }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-amber-500 font-bold font-sans">
                                    ★ {{ item.rating }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-600 leading-relaxed text-xs">
                                    {{ item.comment }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <button 
                                        @click="toggleFeatured(item)"
                                        :class="item.is_featured 
                                            ? 'bg-[#E5C44B]/10 text-[#604b12] border-[#E5C44B]/30' 
                                            : 'bg-zinc-50 text-zinc-400 border-zinc-200'"
                                        class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all hover:shadow-xs"
                                    >
                                        {{ item.is_featured ? 'Nổi bật ★' : 'Thường' }}
                                    </button>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="{
                                            'bg-emerald-50 text-emerald-800 border-emerald-200': item.status === 'approved',
                                            'bg-amber-50 text-amber-800 border-amber-200': item.status === 'pending',
                                            'bg-rose-50 text-rose-800 border-rose-200': item.status === 'rejected',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ item.status === 'approved' ? 'Đã duyệt' : item.status === 'pending' ? 'Chờ duyệt' : 'Từ chối' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <button 
                                            v-if="item.status !== 'approved'"
                                            @click="updateStatus(item.id, 'approved', item.is_featured)" 
                                            class="text-emerald-700 hover:text-emerald-900 font-bold text-sm transition-colors"
                                        >
                                            Duyệt
                                        </button>
                                        <span v-if="item.status !== 'approved' && item.status !== 'rejected'" class="text-zinc-300">|</span>
                                        <button 
                                            v-if="item.status !== 'rejected'"
                                            @click="updateStatus(item.id, 'rejected', item.is_featured)" 
                                            class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="testimonials.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Chưa nhận được đánh giá nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="testimonials.links && testimonials.total > testimonials.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ testimonials.from || 0 }} đến {{ testimonials.to || 0 }} của {{ testimonials.total }} nhận xét
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in testimonials.links"
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


