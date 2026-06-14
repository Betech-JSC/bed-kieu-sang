<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    stats: Object
});
</script>

<template>
    <Head title="Tổng quan - Thảo Mộc Kiều Sang CMS" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                TỔNG QUAN HỆ THỐNG
            </h2>
        </template>

        <div class="space-y-6">
            <!-- Welcome Banner -->
            <div class="bg-gradient-to-r from-[#043616] to-[#112215] rounded-xl p-8 text-[#FFFDF9] relative overflow-hidden border border-[#E5C44B]/20 hover:shadow-md transition-shadow duration-300">
                <div class="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-[#E5C44B]/10 blur-2xl pointer-events-none"></div>
                <div class="relative z-10 space-y-2 max-w-xl">
                    <h3 class="text-xl font-serif font-bold tracking-wide">Xin chào, {{ $page.props.auth.user.name }}!</h3>
                    <p class="text-sm text-[#FAF6EE]/80 leading-relaxed font-sans">
                        Chào mừng bạn trở lại hệ thống quản trị cửa hàng thảo dược. Hôm nay bạn có thể dễ dàng quản lý thông tin sản phẩm, cập nhật tin tức mới, xét duyệt đánh giá khách hàng và xử lý nhanh chóng các đơn đặt hàng.
                    </p>
                </div>
            </div>

            <!-- Stats Grid Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Products count -->
                <div class="bg-[#FFFDF9] rounded-xl p-6 border border-zinc-200/80 flex items-center justify-between hover:shadow-sm transition-shadow duration-300">
                    <div class="space-y-1">
                        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Tổng sản phẩm</span>
                        <span class="text-3xl font-sans font-bold text-[#043616]">{{ stats.products_count }}</span>
                    </div>
                    <div class="w-12 h-12 rounded-lg bg-emerald-50 text-[#043616] flex items-center justify-center border border-emerald-100">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                <!-- Blogs count -->
                <div class="bg-[#FFFDF9] rounded-xl p-6 border border-zinc-200/80 flex items-center justify-between hover:shadow-sm transition-shadow duration-300">
                    <div class="space-y-1">
                        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Bài viết (Blogs)</span>
                        <span class="text-3xl font-sans font-bold text-[#043616]">{{ stats.blogs_count }}</span>
                    </div>
                    <div class="w-12 h-12 rounded-lg bg-emerald-50 text-[#043616] flex items-center justify-center border border-emerald-100">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9" />
                        </svg>
                    </div>
                </div>

                <!-- Orders count -->
                <div class="bg-[#FFFDF9] rounded-xl p-6 border border-zinc-200/80 flex items-center justify-between hover:shadow-sm transition-shadow duration-300">
                    <div class="space-y-1">
                        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Đơn đặt hàng</span>
                        <span class="text-3xl font-sans font-bold text-[#043616]">{{ stats.orders_count }}</span>
                    </div>
                    <div class="w-12 h-12 rounded-lg bg-amber-50 text-[#604b12] flex items-center justify-center border border-amber-100">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        </svg>
                    </div>
                </div>

                <!-- Contacts count -->
                <div class="bg-[#FFFDF9] rounded-xl p-6 border border-zinc-200/80 flex items-center justify-between hover:shadow-sm transition-shadow duration-300">
                    <div class="space-y-1">
                        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Thư liên hệ mới</span>
                        <span class="text-3xl font-sans font-bold text-[#043616]">{{ stats.contacts_count }}</span>
                    </div>
                    <div class="w-12 h-12 rounded-lg bg-[#FAF6EE] text-[#043616] flex items-center justify-center border border-zinc-200">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Recent Orders list -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-[#FAF6EE]/20">
                    <h4 class="text-sm font-sans font-bold text-[#043616] uppercase tracking-wider">Đơn Hàng Gần Đây</h4>
                    <Link :href="route('admin.orders.index')" class="text-[#043616] hover:text-emerald-800 text-xs font-bold transition-colors">Xem tất cả &rarr;</Link>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Mã đơn</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Khách hàng</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-36">Tổng tiền</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28">Thanh toán</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28">Trạng thái</th>
                                <th class="py-4 px-4 w-24 text-center">Xem</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="order in stats.recent_orders" 
                                :key="order.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 font-mono font-bold text-zinc-900 align-middle">#{{ order.order_code }}</td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 text-zinc-900 font-medium align-middle">{{ order.customer_name }}</td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 font-sans text-zinc-800 font-bold align-middle">
                                    {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount) }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60' : 'bg-amber-50 text-amber-800 border-amber-200/60'"
                                        class="px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        {{ order.payment_status === 'paid' ? 'Đã thu' : 'Chờ thu' }}
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
                                        class="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                                    >
                                        {{ order.status === 'completed' ? 'Xong' : order.status === 'processing' ? 'Xử lý' : order.status === 'pending' ? 'Chờ' : 'Huỷ' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-24 whitespace-nowrap">
                                    <Link :href="route('admin.orders.show', order.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                        Chi tiết
                                    </Link>
                                </td>
                            </tr>
                            <tr v-if="stats.recent_orders.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-500">
                                    Chưa ghi nhận đơn hàng nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

