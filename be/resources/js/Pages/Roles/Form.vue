<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
const props = defineProps({ role: Object, permissions: Object });
const form = useForm({ name: props.role?.name || '', description: props.role?.description || '', permission_ids: props.role?.permissions?.map((item) => item.id) || [] });
const submit = () => props.role ? form.put(route('admin.roles.update', props.role.id)) : form.post(route('admin.roles.store'));
</script>
<template><Head :title="role ? 'Sửa vai trò' : 'Tạo vai trò'"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">{{ role ? 'Sửa vai trò' : 'Tạo vai trò' }}</h2></template>
<form class="mx-auto max-w-4xl space-y-6 rounded-lg border border-zinc-200 bg-white p-7" @submit.prevent="submit"><div class="grid gap-4 md:grid-cols-2"><div><label class="text-sm font-bold">Tên vai trò *</label><input v-model="form.name" required class="mt-2 w-full rounded-lg border-zinc-200"/></div><div><label class="text-sm font-bold">Mô tả</label><input v-model="form.description" class="mt-2 w-full rounded-lg border-zinc-200"/></div></div>
<div class="space-y-5"><div v-for="(items, module) in permissions" :key="module" class="border-t border-zinc-100 pt-4"><h3 class="mb-3 text-xs font-bold uppercase text-emerald-900">{{ module.replaceAll('_', ' ') }}</h3><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><label v-for="permission in items" :key="permission.id" class="flex items-center gap-2 text-sm"><input v-model="form.permission_ids" type="checkbox" :value="permission.id" :disabled="role?.slug === 'super_admin'" class="rounded border-zinc-300 text-emerald-800"/>{{ permission.name }}</label></div></div></div>
<div class="flex justify-end gap-3"><Link :href="route('admin.roles.index')" class="rounded-lg border px-5 py-2.5">Hủy</Link><button class="rounded-lg bg-[#043616] px-6 py-2.5 font-semibold text-white">Lưu vai trò</button></div></form></AuthenticatedLayout></template>
