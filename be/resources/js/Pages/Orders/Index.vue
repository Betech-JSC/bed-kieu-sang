<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    orders: Object
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
            <!-- Notifications -->
            <div v-if="$page.props.flash?.success" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                {{ $page.props.flash.success }}
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="p-6">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="border-b border-zinc-200 text-[#043616] font-serif text-sm font-bold">
                                <th class="py-4 px-4">Mã đơn hàng</th>
                                <th class="py-4 px-4">Khách hàng</th>
                                <th class="py-4 px-4">Tổng tiền</th>
                                <th class="py-4 px-4">Thanh toán</th>
                                <th class="py-4 px-4">Trạng thái đơn</th>
                                <th class="py-4 px-4">Thời gian đặt</th>
                                <th class="py-4 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="order in orders.data" 
                                :key="order.id"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 font-mono font-bold text-zinc-900">
                                    #{{ order.order_code }}
                                </td>
                                <td class="py-4 px-4">
                                    <div class="font-medium text-zinc-900">{{ order.customer_name }}</div>
                                    <div class="text-xs text-zinc-500 font-sans mt-0.5">{{ order.customer_phone }}</div>
                                </td>
                                <td class="py-4 px-4 text-zinc-800 font-medium font-sans">
                                    {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount) }}
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="{
                                            'bg-emerald-100 text-emerald-800': order.payment_status === 'paid',
                                            'bg-amber-100 text-amber-800': order.payment_status === 'pending',
                                            'bg-rose-100 text-rose-800': order.payment_status === 'failed',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ order.payment_status === 'paid' ? 'Đã thanh toán' : order.payment_status === 'pending' ? 'Chờ thanh toán' : 'Thanh toán lỗi' }}
                                    </span>
                                    <span class="block text-[10px] text-zinc-400 mt-1 uppercase font-semibold">
                                        {{ order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="{
                                            'bg-emerald-100 text-emerald-800': order.status === 'completed',
                                            'bg-blue-100 text-blue-800': order.status === 'processing',
                                            'bg-amber-100 text-amber-800': order.status === 'pending',
                                            'bg-zinc-100 text-zinc-800': order.status === 'cancelled',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ order.status === 'completed' ? 'Hoàn thành' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'pending' ? 'Chờ xử lý' : 'Đã huỷ' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-zinc-500 text-xs font-sans">
                                    {{ new Date(order.created_at).toLocaleString('vi-VN') }}
                                </td>
                                <td class="py-4 px-4 text-right">
                                    <Link :href="route('admin.orders.show', order.id)" class="text-[#043616] hover:text-emerald-700 font-bold text-sm">
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

                    <!-- Pagination -->
                    <div v-if="orders.links && orders.total > orders.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
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
        </div>
    </AuthenticatedLayout>
</template>
