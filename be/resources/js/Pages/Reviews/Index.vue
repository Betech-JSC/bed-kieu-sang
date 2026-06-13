<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    testimonials: Object
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
            <!-- Notifications -->
            <div v-if="$page.props.flash?.success" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                {{ $page.props.flash.success }}
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="p-6">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="border-b border-zinc-200 text-[#043616] font-serif text-sm font-bold">
                                <th class="py-4 px-4">Khách hàng</th>
                                <th class="py-4 px-4">Sản phẩm</th>
                                <th class="py-4 px-4">Đánh giá</th>
                                <th class="py-4 px-4 w-1/3">Nội dung nhận xét</th>
                                <th class="py-4 px-4">Nổi bật</th>
                                <th class="py-4 px-4">Trạng thái</th>
                                <th class="py-4 px-4 text-right">Duyệt nhanh</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="item in testimonials.data" 
                                :key="item.id"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4">
                                    <div class="flex items-center gap-3">
                                        <img :src="item.customer_avatar || 'https://www.gravatar.com/avatar/?d=mp'" alt="Avatar khách hàng" class="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                                        <div>
                                            <div class="font-medium text-zinc-900">{{ item.customer_name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-4 text-zinc-700 font-medium">
                                    {{ item.product?.name || 'Chung' }}
                                </td>
                                <td class="py-4 px-4 text-amber-500 font-semibold font-sans">
                                    ★ {{ item.rating }}
                                </td>
                                <td class="py-4 px-4 text-zinc-600 leading-relaxed text-xs">
                                    {{ item.comment }}
                                </td>
                                <td class="py-4 px-4">
                                    <button 
                                        @click="toggleFeatured(item)"
                                        :class="item.is_featured ? 'bg-[#E5C44B]/20 text-[#604b12] border-[#E5C44B]' : 'bg-zinc-50 text-zinc-400 border-zinc-200'"
                                        class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all"
                                    >
                                        {{ item.is_featured ? 'Nổi bật ★' : 'Thường' }}
                                    </button>
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="{
                                            'bg-emerald-100 text-emerald-800': item.status === 'approved',
                                            'bg-amber-100 text-amber-800': item.status === 'pending',
                                            'bg-rose-100 text-rose-800': item.status === 'rejected',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ item.status === 'approved' ? 'Đã duyệt' : item.status === 'pending' ? 'Chờ duyệt' : 'Đã từ chối' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-right space-x-3">
                                    <button 
                                        v-if="item.status !== 'approved'"
                                        @click="updateStatus(item.id, 'approved', item.is_featured)" 
                                        class="text-emerald-600 hover:text-emerald-800 font-semibold text-xs"
                                    >
                                        Duyệt
                                    </button>
                                    <button 
                                        v-if="item.status !== 'rejected'"
                                        @click="updateStatus(item.id, 'rejected', item.is_featured)" 
                                        class="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                                    >
                                        Từ chối
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="testimonials.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Chưa nhận được đánh giá nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div v-if="testimonials.links && testimonials.total > testimonials.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
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
        </div>
    </AuthenticatedLayout>
</template>

