<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
    order: Object
});

const form = useForm({
    status: props.order.status,
    payment_status: props.order.payment_status,
});

const submit = () => {
    form.put(route('admin.orders.update', props.order.id));
};
</script>

<template>
    <Head :title="`Chi tiết đơn hàng #${order.order_code}`" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    Chi Tiết Đơn Hàng #{{ order.order_code }}
                </h2>
                <Link
                    :href="route('admin.orders.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Notifications -->
            <div v-if="$page.props.flash?.success" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                {{ $page.props.flash.success }}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left: Invoice Details & Items -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Invoice Card -->
                    <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80 p-8 space-y-6">
                        <div class="flex justify-between items-start pb-6 border-b border-zinc-100">
                            <div>
                                <h3 class="text-lg font-serif font-bold text-emerald-950">HOÁ ĐƠN MUA HÀNG</h3>
                                <p class="text-xs text-zinc-400 font-semibold tracking-wider mt-1">MÃ ĐƠN: #{{ order.order_code }}</p>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider">Ngày lập</span>
                                <span class="text-sm text-zinc-700 font-sans font-medium">{{ new Date(order.created_at).toLocaleString('vi-VN') }}</span>
                            </div>
                        </div>

                        <!-- Customer details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100 text-sm">
                            <div>
                                <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider">Khách hàng</span>
                                <span class="text-zinc-900 font-bold block mt-0.5">{{ order.customer_name }}</span>
                                <span class="text-zinc-600 font-sans block mt-0.5">{{ order.customer_phone }}</span>
                                <span class="text-zinc-600 block mt-0.5">{{ order.customer_email }}</span>
                            </div>
                            <div>
                                <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider">Địa chỉ giao hàng</span>
                                <span class="text-zinc-700 block mt-0.5 leading-relaxed">{{ order.shipping_address }}</span>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div v-if="order.notes" class="bg-[#FAF6EE]/40 border border-zinc-200/50 rounded-lg p-4 text-xs">
                            <span class="font-bold text-[#043616] block mb-1">Ghi chú từ khách hàng:</span>
                            <p class="text-zinc-700 whitespace-pre-line leading-relaxed">{{ order.notes }}</p>
                        </div>

                        <!-- Order items table -->
                        <div class="space-y-4">
                            <h4 class="text-sm font-serif font-bold text-emerald-950 uppercase tracking-wide">Danh sách sản phẩm mua</h4>
                            <table class="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr class="border-b border-zinc-100 text-[#043616] font-serif font-bold text-xs">
                                        <th class="py-2">Sản phẩm</th>
                                        <th class="py-2 text-right">Đơn giá</th>
                                        <th class="py-2 text-center w-20">Số lượng</th>
                                        <th class="py-2 text-right w-32">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in order.items" :key="item.id" class="border-b border-zinc-50 py-3 text-xs">
                                        <td class="py-3 flex items-center gap-3">
                                            <img :src="item.product?.image_path || '/images/smudge_stick.png'" alt="Ảnh sản phẩm" class="w-10 h-10 rounded-lg object-cover border border-zinc-200" />
                                            <span class="font-medium text-zinc-800">{{ item.product?.name || 'Sản phẩm đã bị xoá' }}</span>
                                        </td>
                                        <td class="py-3 text-right text-zinc-600 font-sans">
                                            {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) }}
                                        </td>
                                        <td class="py-3 text-center text-zinc-700 font-sans font-medium">
                                            {{ item.quantity }}
                                        </td>
                                        <td class="py-3 text-right text-zinc-950 font-sans font-bold">
                                            {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Total -->
                        <div class="flex justify-end pt-4">
                            <div class="text-right space-y-1">
                                <span class="text-xs text-zinc-400 font-semibold block uppercase tracking-wider">Tổng cộng đơn hàng</span>
                                <span class="text-2xl font-sans font-bold text-[#043616]">
                                    {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Actions & Statuses -->
                <div class="space-y-6">
                    <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80 p-6 space-y-6">
                        <h3 class="text-sm font-serif font-bold text-[#043616] uppercase tracking-wide">Trạng Thái & Giao Dịch</h3>

                        <form @submit.prevent="submit" class="space-y-4 text-sm">
                            <!-- Order Status -->
                            <div class="flex flex-col space-y-1.5">
                                <label class="text-xs font-bold text-zinc-700">Trạng thái đơn hàng</label>
                                <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-950 focus:border-[#043616] outline-none">
                                    <option value="pending">Chờ xử lý (Pending)</option>
                                    <option value="processing">Đang xử lý (Processing)</option>
                                    <option value="completed">Đã giao/Hoàn thành (Completed)</option>
                                    <option value="cancelled">Đã hủy (Cancelled)</option>
                                </select>
                            </div>

                            <!-- Payment Status -->
                            <div class="flex flex-col space-y-1.5">
                                <label class="text-xs font-bold text-zinc-700">Trạng thái thanh toán</label>
                                <select v-model="form.payment_status" required class="border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-950 focus:border-[#043616] outline-none">
                                    <option value="pending">Chờ thanh toán (Pending)</option>
                                    <option value="paid">Đã thanh toán (Paid)</option>
                                    <option value="failed">Thanh toán thất bại (Failed)</option>
                                </select>
                            </div>

                            <!-- Payment Method info -->
                            <div class="pt-2">
                                <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider">Hình thức thanh toán</span>
                                <span class="text-sm font-medium text-zinc-800 mt-1 block">
                                    {{ order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng' }}
                                </span>
                            </div>

                            <!-- Save button -->
                            <button 
                                type="submit" 
                                :disabled="form.processing"
                                class="w-full bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 mt-4 hover:shadow-sm"
                            >
                                Cập nhật trạng thái
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
