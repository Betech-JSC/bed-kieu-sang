<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
const props = defineProps({ users: Object, roles: Array, filters: Object });
const search = ref(props.filters?.search || ''); const roleId = ref(props.filters?.role_id || ''); let timer;
const filter = () => { clearTimeout(timer); timer = setTimeout(() => router.get(route('admin.users.index'), { search: search.value, role_id: roleId.value }, { preserveState: true, replace: true }), 250); };
watch(search, filter); watch(roleId, filter);
const remove = (id) => confirm('Xóa tài khoản này?') && router.delete(route('admin.users.destroy', id));
</script>
<template><Head title="Quản lý người dùng"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">Quản lý người dùng</h2></template>
<div class="space-y-5"><div class="flex flex-col justify-between gap-3 sm:flex-row"><div class="flex gap-3"><input v-model="search" placeholder="Tìm tên hoặc email..." class="rounded-lg border-zinc-200"/><select v-model="roleId" class="rounded-lg border-zinc-200"><option value="">Tất cả vai trò</option><option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option></select></div><Link :href="route('admin.users.create')" class="rounded-lg bg-[#043616] px-5 py-2.5 text-center text-sm font-semibold text-white">Tạo tài khoản</Link></div>
<div class="overflow-hidden rounded-lg border border-zinc-200 bg-white"><table class="w-full text-left text-sm"><thead class="bg-zinc-50 text-xs uppercase text-emerald-950"><tr><th class="p-4">Người dùng</th><th class="p-4">Vai trò</th><th class="p-4">Quyền</th><th class="p-4 w-32">Thao tác</th></tr></thead><tbody class="divide-y divide-zinc-100"><tr v-for="user in users.data" :key="user.id"><td class="p-4"><strong>{{ user.name }}</strong><p class="text-xs text-zinc-500">{{ user.email }}</p></td><td class="p-4">{{ user.role_model?.name || user.role }}</td><td class="p-4 text-xs text-zinc-600">{{ user.role_model?.slug === 'super_admin' ? 'Toàn quyền hệ thống' : `${user.role_model?.permissions?.length || 0} quyền` }}</td><td class="p-4"><Link :href="route('admin.users.edit', user.id)" class="font-semibold text-emerald-800">Sửa</Link><button v-if="user.id !== $page.props.auth.user.id" class="ml-4 font-semibold text-rose-600" @click="remove(user.id)">Xóa</button></td></tr></tbody></table></div></div></AuthenticatedLayout></template>
