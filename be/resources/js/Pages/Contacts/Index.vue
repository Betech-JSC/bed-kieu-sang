<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    contacts: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.contacts.index'), {
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
    router.get(route('admin.contacts.index'), {
        search: search.value,
        status: status.value
    }, {
        preserveState: true,
        replace: true
    });
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
            <!-- Filters & Search Bar -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <div class="flex flex-wrap items-center gap-3">
                    <input 
                        v-model="search" 
                        type="text" 
                        placeholder="Tìm kiếm liên hệ..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="status" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                    </select>
                </div>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-48">Người gửi</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Thông tin liên hệ</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Tiêu đề liên hệ</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Trạng thái</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-48">Thời gian nhận</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="contact in contacts.data" 
                                :key="contact.id"
                                :class="contact.status === 'unread' ? 'font-semibold bg-[#FAF6EE]/25' : 'text-[#2a2a2b]'"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-900 font-bold">
                                    {{ contact.name }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="text-zinc-800">{{ contact.email }}</div>
                                    <div class="text-xs text-zinc-500 font-sans mt-0.5">{{ contact.phone }}</div>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle truncate max-w-xs text-zinc-650">
                                    {{ contact.subject || 'Liên hệ mua hàng/tư vấn' }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="contact.status === 'unread' 
                                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                            : 'bg-zinc-50 text-zinc-650 border-zinc-200'" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ contact.status === 'unread' ? 'Chưa đọc' : 'Đã đọc' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-550 text-xs font-sans">
                                    {{ new Date(contact.created_at).toLocaleString('vi-VN') }}
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.contacts.show', contact.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Xem
                                        </Link>
                                        <span class="text-zinc-300">|</span>
                                        <button @click="deleteContact(contact.id)" class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors">
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="contacts.data.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-500">
                                    Không có lời nhắn liên hệ nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="contacts.links && contacts.total > contacts.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
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
    </AuthenticatedLayout>
</template>

