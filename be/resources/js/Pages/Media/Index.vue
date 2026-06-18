<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router, useForm } from '@inertiajs/vue3';
const props = defineProps({ media: Object });
const upload = useForm({ files: [] });
const chooseFiles = (event) => { upload.files = Array.from(event.target.files); };
const submit = () => upload.post(route('admin.media.store'), { forceFormData: true, onSuccess: () => upload.reset() });
const copy = (url) => navigator.clipboard.writeText(url);
const remove = (id) => confirm('Xóa vĩnh viễn file này?') && router.delete(route('admin.media.destroy', id));
const saveAlt = (item) => router.patch(route('admin.media.update', item.id), { alt_text: item.alt_text }, { preserveScroll: true });
</script>
<template><Head title="Thư viện media"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">File và thư viện media</h2></template>
<div class="space-y-6"><form class="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center" @submit.prevent="submit"><input type="file" multiple accept="image/*" class="flex-1 text-sm" @change="chooseFiles"/><button :disabled="upload.processing || !upload.files.length" class="rounded-lg bg-[#043616] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Tải lên</button></form>
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><article v-for="item in media.data" :key="item.id" class="overflow-hidden rounded-lg border border-zinc-200 bg-white"><div class="aspect-video bg-zinc-50"><img :src="item.url" :alt="item.alt_text || item.original_name" class="h-full w-full object-cover"/></div><div class="space-y-3 p-4"><p class="truncate text-sm font-semibold" :title="item.original_name">{{ item.original_name }}</p><input v-model="item.alt_text" placeholder="Mô tả ảnh (alt text)" class="w-full rounded-lg border-zinc-200 text-sm"/><div class="flex justify-between text-xs font-semibold"><button class="text-emerald-800" @click="saveAlt(item)">Lưu mô tả</button><button class="text-zinc-600" @click="copy(item.url)">Sao chép URL</button><button class="text-rose-600" @click="remove(item.id)">Xóa</button></div></div></article></div>
<div v-if="!media.data.length" class="rounded-lg border bg-white p-10 text-center text-zinc-500">Thư viện chưa có file.</div></div></AuthenticatedLayout></template>
