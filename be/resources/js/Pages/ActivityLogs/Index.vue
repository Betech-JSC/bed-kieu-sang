<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

defineProps({
    logs: Object
});

const expandedLogId = ref(null);

const toggleExpand = (id) => {
    expandedLogId.value = expandedLogId.value === id ? null : id;
};

const formatJson = (val) => {
    if (!val) return 'Trống';
    try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        return val;
    }
};
</script>

<template>
    <Head title="Nhật ký hoạt động" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-48">Thời gian</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-52">Quản trị viên</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Hành động</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-40">Phân hệ</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Chi tiết hoạt động</th>
                                <th class="py-4 px-4 w-28 text-center">Dữ liệu</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <template v-for="log in logs.data" :key="log.id">
                                <tr 
                                    class="hover:bg-[#FAF6EE]/30 transition-colors text-sm"
                                    :class="expandedLogId === log.id ? 'bg-[#FAF6EE]/20' : ''"
                                >
                                    <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-500 text-xs font-sans">
                                        {{ new Date(log.created_at).toLocaleString('vi-VN') }}
                                    </td>
                                    <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-900 font-bold">
                                        {{ log.user?.name || 'Hệ thống' }}
                                    </td>
                                    <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                        <span 
                                            :class="{
                                                'bg-emerald-50 text-emerald-800 border-emerald-200': log.action === 'CREATE',
                                                'bg-blue-50 text-blue-800 border-blue-200': log.action === 'UPDATE',
                                                'bg-rose-50 text-rose-800 border-rose-200': log.action === 'DELETE',
                                            }"
                                            class="px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider"
                                        >
                                            {{ log.action }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-[#043616] font-mono text-xs uppercase font-bold">
                                        {{ log.table_name }}
                                    </td>
                                    <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-700 text-xs font-medium">
                                        {{ log.description }}
                                    </td>
                                    <td class="py-4 px-4 align-middle text-center w-28 whitespace-nowrap">
                                        <button 
                                            v-if="log.old_value || log.new_value"
                                            @click="toggleExpand(log.id)"
                                            class="text-[#043616] hover:text-emerald-800 text-xs font-bold underline"
                                        >
                                            {{ expandedLogId === log.id ? 'Thu gọn' : 'Xem JSON' }}
                                        </button>
                                        <span v-else class="text-zinc-400 text-xs">-</span>
                                    </td>
                                </tr>
                                <!-- Expandable JSON Diffs -->
                                <tr v-if="expandedLogId === log.id" class="bg-zinc-50/70 border-b border-zinc-200/80">
                                    <td colspan="6" class="p-6">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                            <div>
                                                <span class="font-bold text-zinc-500 uppercase block mb-2 font-sans tracking-wide">Dữ liệu cũ (Old Value)</span>
                                                <pre class="bg-zinc-950 text-emerald-400 p-4 rounded-xl overflow-x-auto font-mono max-h-60 leading-relaxed border border-zinc-800">{{ formatJson(log.old_value) }}</pre>
                                            </div>
                                            <div>
                                                <span class="font-bold text-zinc-500 uppercase block mb-2 font-sans tracking-wide">Dữ liệu mới (New Value)</span>
                                                <pre class="bg-zinc-950 text-emerald-400 p-4 rounded-xl overflow-x-auto font-mono max-h-60 leading-relaxed border border-zinc-800">{{ formatJson(log.new_value) }}</pre>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr v-if="logs.data.length === 0">
                                <td colspan="6" class="py-8 text-center text-zinc-500">
                                    Chưa ghi nhận hoạt động nào trong hệ thống.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="logs.links && logs.total > logs.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ logs.from || 0 }} đến {{ logs.to || 0 }} của {{ logs.total }} dòng nhật ký
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in logs.links"
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

