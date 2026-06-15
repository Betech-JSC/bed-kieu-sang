<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    orders: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.orders.index'), {
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
    router.get(route('admin.orders.index'), {
        search: search.value,
        status: status.value
    }, {
        preserveState: true,
        replace: true
    });
});
</script>

<template>
    <Head title="Quản lý đơn hàng" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH ĐƠN ĐẶT HÀNG
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
                        placeholder="Tìm kiếm đơn hàng..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="status" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã huỷ</option>
                    </select>
                </div>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Mã đơn hàng</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Khách hàng</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36">Tổng tiền</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-40">Thanh toán</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Trạng thái đơn</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-44">Thời gian đặt</th>
                                <th class="py-4 px-4 w-24 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="order in orders.data" 
                                :key="order.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-mono font-bold text-zinc-900">
                                    #{{ order.order_code }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900">{{ order.customer_name }}</div>
                                    <div class="text-xs text-zinc-500 font-sans mt-0.5">{{ order.customer_phone }}</div>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-800 font-bold font-sans">
                                    {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount) }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="{
                                            'bg-emerald-50 text-emerald-800 border-emerald-200': order.payment_status === 'paid',
                                            'bg-amber-50 text-amber-800 border-amber-200': order.payment_status === 'pending',
                                            'bg-rose-50 text-rose-800 border-rose-200': order.payment_status === 'failed',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ order.payment_status === 'paid' ? 'Đã thanh toán' : order.payment_status === 'pending' ? 'Chờ thanh toán' : 'Thanh toán lỗi' }}
                                    </span>
                                    <span class="block text-[10px] text-zinc-400 mt-1.5 uppercase font-bold tracking-wider">
                                        {{ order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản QR' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="{
                                            'bg-emerald-50 text-emerald-800 border-emerald-200': order.status === 'completed',
                                            'bg-blue-50 text-blue-800 border-blue-200': order.status === 'processing',
                                            'bg-amber-50 text-amber-800 border-amber-200': order.status === 'pending',
                                            'bg-zinc-50 text-zinc-700 border-zinc-200': order.status === 'cancelled',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ order.status === 'completed' ? 'Hoàn thành' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'pending' ? 'Chờ xử lý' : 'Đã huỷ' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-500 text-xs font-sans">
                                    {{ new Date(order.created_at).toLocaleString('vi-VN') }}
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-24 whitespace-nowrap">
                                    <Link :href="route('admin.orders.show', order.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                        Xem
                                    </Link>
                                </td>
                            </tr>
                            <tr v-if="orders.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Chưa có đơn hàng nào được tạo.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="orders.links && orders.total > orders.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ orders.from || 0 }} đến {{ orders.to || 0 }} của {{ orders.total }} đơn hàng
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in orders.links"
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

