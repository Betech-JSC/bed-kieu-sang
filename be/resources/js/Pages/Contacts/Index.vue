<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';

defineProps({
    contacts: Object
});

const deleteContact = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa tin nhắn liên hệ này?')) {
        router.delete(route('admin.contacts.destroy', id));
    }
};
</script>

<template>
    <Head title="Hộp thư liên hệ" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    HỘP THƯ LIÊN HỆ & TƯ VẤN
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
                                <th class="py-4 px-4">Người gửi</th>
                                <th class="py-4 px-4">Thông tin liên hệ</th>
                                <th class="py-4 px-4">Tiêu đề liên hệ</th>
                                <th class="py-4 px-4">Trạng thái</th>
                                <th class="py-4 px-4">Thời gian nhận</th>
                                <th class="py-4 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="contact in contacts.data" 
                                :key="contact.id"
                                :class="contact.status === 'unread' ? 'font-semibold bg-[#FAF6EE]/25' : 'text-[#2a2a2b]'"
                                class="border-b border-zinc-100 hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 text-zinc-900 font-medium">
                                    {{ contact.name }}
                                </td>
                                <td class="py-4 px-4">
                                    <div>{{ contact.email }}</div>
                                    <div class="text-xs text-zinc-500 font-sans mt-0.5">{{ contact.phone }}</div>
                                </td>
                                <td class="py-4 px-4 truncate max-w-xs text-zinc-800">
                                    {{ contact.subject || 'Liên hệ mua hàng/tư vấn' }}
                                </td>
                                <td class="py-4 px-4">
                                    <span 
                                        :class="contact.status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {{ contact.status === 'unread' ? 'Chưa đọc' : 'Đã đọc' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-zinc-500 text-xs font-sans">
                                    {{ new Date(contact.created_at).toLocaleString('vi-VN') }}
                                </td>
                                <td class="py-4 px-4 text-right space-x-3">
                                    <Link :href="route('admin.contacts.show', contact.id)" class="text-[#043616] hover:text-emerald-700 font-bold text-sm">
                                        Xem
                                    </Link>
                                    <button @click="deleteContact(contact.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="contacts.data.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-500">
                                    Không có lời nhắn liên hệ nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div v-if="contacts.links && contacts.total > contacts.per_page" class="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100">
                        <div class="text-xs text-zinc-500">
                            Hiển thị từ {{ contacts.from || 0 }} đến {{ contacts.to || 0 }} của {{ contacts.total }} liên hệ
                        </div>
                        <div class="flex gap-1">
                            <Link
                                v-for="(link, idx) in contacts.links"
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
