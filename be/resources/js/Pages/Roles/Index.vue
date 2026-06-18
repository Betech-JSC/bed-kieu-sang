<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { reactive } from 'vue';

const props = defineProps({
    roles: { type: Array, default: () => [] },
    permissions: { type: Object, default: () => ({}) },
});

const selectedPermissions = reactive(
    Object.fromEntries(
        props.roles.map((role) => [
            role.id,
            (role.permissions || []).map((permission) => permission.id),
        ]),
    ),
);
const saving = reactive({});

const remove = (id) => {
    if (confirm('Xóa vai trò này?')) router.delete(route('admin.roles.destroy', id));
};

const savePermissions = (role) => {
    router.put(
        route('admin.roles.permissions.update', role.id),
        { permission_ids: selectedPermissions[role.id] || [] },
        {
            preserveScroll: true,
            onStart: () => (saving[role.id] = true),
            onFinish: () => (saving[role.id] = false),
        },
    );
};
</script>

<template>
    <Head title="Vai trò và phân quyền" />
    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-lg font-bold uppercase text-emerald-950">Vai trò và phân quyền</h2>
        </template>

        <div class="space-y-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 class="font-serif text-xl font-bold text-emerald-950">Ma trận phân quyền</h3>
                    <p class="mt-1 text-sm text-zinc-600">Bật hoặc tắt quyền theo từng vai trò rồi lưu trực tiếp.</p>
                </div>
                <Link :href="route('admin.roles.create')" class="rounded-lg bg-[#043616] px-5 py-2.5 text-center text-sm font-semibold text-white">
                    Tạo vai trò
                </Link>
            </div>

            <div v-if="!roles.length" class="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-600">
                Chưa có vai trò nào. Hãy tạo vai trò đầu tiên để bắt đầu phân quyền.
            </div>

            <div v-else-if="!Object.keys(permissions).length" class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Chưa có dữ liệu quyền. Vui lòng chạy migration mới nhất để khởi tạo hệ thống phân quyền.
            </div>

            <div v-else class="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
                <table class="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead class="sticky top-0 z-10 bg-emerald-950 text-white">
                        <tr>
                            <th class="min-w-64 p-4 font-semibold">Quyền</th>
                            <th v-for="role in roles" :key="role.id" class="min-w-48 border-l border-white/10 p-4 text-center align-top">
                                <div class="font-semibold">{{ role.name }}</div>
                                <div class="mt-1 text-[11px] font-normal text-emerald-100">{{ role.users_count }} người dùng</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(items, module) in permissions" :key="module">
                            <tr class="border-t border-zinc-200 bg-[#FAF6EE]">
                                <th :colspan="roles.length + 1" class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                                    {{ String(module).replaceAll('_', ' ') }}
                                </th>
                            </tr>
                            <tr v-for="permission in items" :key="permission.id" class="border-t border-zinc-100 hover:bg-zinc-50/70">
                                <td class="p-4">
                                    <div class="font-medium text-zinc-900">{{ permission.name }}</div>
                                    <code class="mt-1 block text-[11px] text-zinc-500">{{ permission.key }}</code>
                                </td>
                                <td v-for="role in roles" :key="role.id" class="border-l border-zinc-100 p-4 text-center">
                                    <input
                                        v-model="selectedPermissions[role.id]"
                                        type="checkbox"
                                        :value="permission.id"
                                        :disabled="role.slug === 'super_admin'"
                                        :aria-label="`${permission.name} cho ${role.name}`"
                                        class="h-4 w-4 rounded border-zinc-300 text-emerald-800 focus:ring-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <tfoot class="border-t border-zinc-200 bg-zinc-50">
                        <tr>
                            <td class="p-4 text-xs text-zinc-500">Super Admin luôn có toàn quyền hệ thống.</td>
                            <td v-for="role in roles" :key="role.id" class="border-l border-zinc-200 p-4 text-center">
                                <button
                                    v-if="role.slug !== 'super_admin'"
                                    type="button"
                                    :disabled="saving[role.id]"
                                    class="rounded-lg bg-[#043616] px-4 py-2 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                                    @click="savePermissions(role)"
                                >
                                    {{ saving[role.id] ? 'Đang lưu…' : `Lưu ${role.name}` }}
                                </button>
                                <span v-else class="text-xs font-semibold text-amber-700">Được bảo vệ</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <article v-for="role in roles" :key="role.id" class="rounded-lg border border-zinc-200 bg-white p-5">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h3 class="font-bold text-emerald-950">{{ role.name }}</h3>
                            <p class="mt-1 text-xs text-zinc-500">{{ role.permissions?.length || 0 }} quyền · {{ role.users_count }} người dùng</p>
                        </div>
                        <span v-if="role.is_system" class="text-xs font-semibold text-amber-700">Hệ thống</span>
                    </div>
                    <p class="mt-3 text-sm text-zinc-600">{{ role.description || 'Chưa có mô tả.' }}</p>
                    <div class="mt-4 flex gap-4 text-sm font-semibold">
                        <Link :href="route('admin.roles.edit', role.id)" class="text-emerald-800">Sửa thông tin</Link>
                        <button v-if="!role.is_system && !role.users_count" class="text-rose-600" @click="remove(role.id)">Xóa</button>
                    </div>
                </article>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
