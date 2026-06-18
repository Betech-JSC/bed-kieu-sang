<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
defineProps({ roles: Array });
const remove = (id) => confirm('Xóa vai trò này?') && router.delete(route('admin.roles.destroy', id));
</script>
<template><Head title="Vai trò và phân quyền"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">Vai trò và phân quyền</h2></template>
<div class="space-y-5"><div class="flex justify-end"><Link :href="route('admin.roles.create')" class="rounded-lg bg-[#043616] px-5 py-2.5 text-sm font-semibold text-white">Tạo vai trò</Link></div><div class="grid gap-4 md:grid-cols-2"><article v-for="role in roles" :key="role.id" class="rounded-lg border border-zinc-200 bg-white p-6"><div class="flex justify-between"><div><h3 class="font-bold text-emerald-950">{{ role.name }}</h3><p class="text-xs text-zinc-500">{{ role.users_count }} người dùng · {{ role.permissions.length }} quyền</p></div><span v-if="role.is_system" class="text-xs font-semibold text-amber-700">Hệ thống</span></div><p class="mt-3 text-sm text-zinc-600">{{ role.description || 'Chưa có mô tả.' }}</p><div class="mt-4 flex gap-4 text-sm font-semibold"><Link :href="route('admin.roles.edit', role.id)" class="text-emerald-800">Sửa quyền</Link><button v-if="!role.is_system && !role.users_count" class="text-rose-600" @click="remove(role.id)">Xóa</button></div></article></div></div></AuthenticatedLayout></template>
