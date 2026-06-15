<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    users: Object,
    availablePermissions: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const role = ref(props.filters?.role || '');

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.users.index'), {
            search: search.value,
            role: role.value
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);
};

watch(search, handleFilterChange);
watch(role, () => {
    router.get(route('admin.users.index'), {
        search: search.value,
        role: role.value
    }, {
        preserveState: true,
        replace: true
    });
});

const deleteUser = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.')) {
        router.delete(route('admin.users.destroy', id));
    }
};

const getRoleBadgeClass = (userRole) => {
    switch (userRole) {
        case 'super_admin':
            return 'bg-red-50 text-red-800 border-red-200';
        case 'editor':
            return 'bg-emerald-50 text-emerald-800 border-emerald-200';
        case 'viewer':
        default:
            return 'bg-zinc-50 text-zinc-600 border-zinc-200';
    }
};

const getRoleLabel = (userRole) => {
    switch (userRole) {
        case 'super_admin':
            return 'Super Admin';
        case 'editor':
            return 'Biên tập viên';
        case 'viewer':
        default:
            return 'Người xem';
    }
};
</script>

<template>
    <Head title="Quản lý nhân viên" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    DANH SÁCH NHÂN VIÊN & PHÂN QUYỀN
                </h2>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Filters & Actions Bar -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <!-- Left: Filters -->
                <div class="flex flex-wrap items-center gap-3">
                    <input 
                        v-model="search" 
                        type="text" 
                        placeholder="Tìm theo tên hoặc email..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="role" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="editor">Biên tập viên</option>
                        <option value="viewer">Người xem</option>
                    </select>
                </div>

                <!-- Right: Action Button -->
                <Link
                    :href="route('admin.users.create')"
                    class="h-10 flex items-center justify-center gap-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] px-5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo tài khoản mới
                </Link>
            </div>

            <!-- Table System (Bordered) -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-16 text-center">ID</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Họ tên & Email</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-44">Vai trò (Role)</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Quyền hạn (Permissions)</th>
                                <th class="py-4 px-4 w-32 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="user in users.data" 
                                :key="user.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-center w-16 text-zinc-500 font-mono">
                                    {{ user.id }}
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="font-bold text-zinc-900">{{ user.name }}</div>
                                    <div class="text-xs text-zinc-500 font-mono">{{ user.email }}</div>
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="getRoleBadgeClass(user.role)" 
                                        class="px-2.5 py-1 rounded-full text-xs font-semibold border"
                                    >
                                        {{ getRoleLabel(user.role) }}
                                    </span>
                                </td>

                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div v-if="user.role === 'super_admin'" class="text-xs text-red-600 font-bold italic">
                                        * Toàn quyền hệ thống
                                    </div>
                                    <div v-else-if="user.permissions && user.permissions.length > 0" class="flex flex-wrap gap-1">
                                        <span 
                                            v-for="perm in user.permissions" 
                                            :key="perm"
                                            class="bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2 py-0.5 rounded text-[11px] font-medium"
                                        >
                                            {{ availablePermissions[perm] || perm }}
                                        </span>
                                    </div>
                                    <div v-else class="text-xs text-zinc-400 italic">
                                        Không có quyền sửa đổi (Chỉ đọc)
                                    </div>
                                </td>

                                <td class="py-4 px-4 align-middle text-center w-32 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-3">
                                        <Link :href="route('admin.users.edit', user.id)" class="text-[#043616] hover:text-emerald-800 font-bold text-sm transition-colors">
                                            Sửa
                                        </Link>
                                        <span v-if="user.id !== $page.props.auth.user.id" class="text-zinc-300">|</span>
                                        <button 
                                            v-if="user.id !== $page.props.auth.user.id"
                                            @click="deleteUser(user.id)" 
                                            class="text-rose-600 hover:text-rose-800 font-bold text-sm transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="users.data.length === 0">
                                <td colspan="5" class="py-8 text-center text-zinc-500">
                                    Không tìm thấy nhân viên nào phù hợp.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="users.links && users.total > users.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ users.from || 0 }} đến {{ users.to || 0 }} của {{ users.total }} nhân viên
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in users.links"
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
