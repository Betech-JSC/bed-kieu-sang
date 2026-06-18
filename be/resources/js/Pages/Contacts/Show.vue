<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    contact: Object
});
</script>

<template>
    <Head title="Chi tiết thư liên hệ" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    CHI TIẾT LỜI NHẮN TỪ KHÁCH HÀNG
                </h2>
                <Link
                    :href="route('admin.contacts.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại hộp thư
                </Link>
            </div>
        </template>

        <div class="space-y-6 max-w-3xl">
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="p-8 space-y-6">
                    <!-- Message info headers -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-250/60">
                        <div>
                            <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider font-sans">Người gửi</span>
                            <span class="text-sm font-bold text-zinc-900 mt-1 block">{{ contact.name }}</span>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider font-sans">Thời gian nhận</span>
                            <span class="text-sm text-zinc-700 font-sans mt-1 block">{{ new Date(contact.created_at).toLocaleString('vi-VN') }}</span>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider font-sans">Địa chỉ Email</span>
                            <a :href="`mailto:${contact.email}`" class="text-[#043616] hover:text-emerald-800 hover:underline text-sm font-bold mt-1 block">{{ contact.email }}</a>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider font-sans">Số điện thoại</span>
                            <a :href="`tel:${contact.phone}`" class="text-zinc-700 hover:text-zinc-900 hover:underline text-sm font-sans font-bold mt-1 block">{{ contact.phone }}</a>
                        </div>
                    </div>

                    <!-- Subject -->
                    <div>
                        <span class="text-xs font-semibold uppercase text-zinc-400 block tracking-wider font-sans">Tiêu đề liên hệ</span>
                        <span class="text-sm font-serif font-bold text-emerald-950 block mt-1.5">{{ contact.subject || 'Liên hệ mua hàng/tư vấn' }}</span>
                    </div>

                    <!-- Message Body -->
                    <div class="bg-[#FAF6EE]/40 border border-zinc-200/50 rounded-xl p-6">
                        <span class="text-xs font-bold uppercase text-[#043616] block tracking-wider mb-2 font-sans">Nội dung thư</span>
                        <p class="text-zinc-800 text-sm whitespace-pre-line leading-relaxed font-sans">{{ contact.message }}</p>
                    </div>

                    <!-- Quick reply link -->
                    <div class="flex justify-end pt-4 border-t border-zinc-100">
                        <a 
                            :href="`mailto:${contact.email}?subject=Re: ${contact.subject || 'Liên hệ Xông Nhà Tẩy Uế'}`"
                            class="bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:shadow-sm"
                        >
                            Phản hồi qua Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
