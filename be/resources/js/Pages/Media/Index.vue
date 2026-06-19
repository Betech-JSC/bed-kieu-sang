<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router, useForm } from '@inertiajs/vue3';
const props = defineProps({ media: Object });
const upload = useForm({ files: [] });
const chooseFiles = (event) => { upload.files = Array.from(event.target.files); };
const getObjectURL = (file) => {
    return URL.createObjectURL(file);
};
const removeSelectedFile = (index) => {
    upload.files.splice(index, 1);
};
const submit = () => upload.post(route('admin.media.store'), { forceFormData: true, onSuccess: () => upload.reset() });
const copy = (url) => navigator.clipboard.writeText(url);
const remove = (id) => confirm('Xóa vĩnh viễn file này?') && router.delete(route('admin.media.destroy', id));
const saveAlt = (item) => router.patch(route('admin.media.update', item.id), { alt_text: item.alt_text }, { preserveScroll: true });
</script>
<template><Head title="Thư viện media"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">File và thư viện media</h2></template>
<div class="space-y-6">
<form class="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5" @submit.prevent="submit">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input type="file" multiple accept="image/*" class="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" @change="chooseFiles"/>
        <button :disabled="upload.processing || !upload.files.length" class="rounded-lg bg-[#043616] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Tải lên</button>
    </div>
    <!-- Previews -->
    <div v-if="upload.files.length" class="mt-2 border-t border-zinc-100 pt-4">
        <p class="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">Xem trước ảnh sắp tải lên:</p>
        <div class="flex flex-wrap gap-3">
            <div v-for="(file, index) in upload.files" :key="index" class="relative group w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                <img :src="getObjectURL(file)" class="w-full h-full object-cover" />
                <button type="button" @click="removeSelectedFile(index)" class="absolute top-1 right-1 bg-rose-600/90 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700 transition-colors" title="Xóa bỏ file này">
                    &times;
                </button>
            </div>
        </div>
    </div>
</form>
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><article v-for="item in media.data" :key="item.id" class="overflow-hidden rounded-lg border border-zinc-200 bg-white"><div class="aspect-video bg-zinc-50"><img :src="item.url" :alt="item.alt_text || item.original_name" class="h-full w-full object-cover"/></div><div class="space-y-3 p-4"><p class="truncate text-sm font-semibold" :title="item.original_name">{{ item.original_name }}</p><input v-model="item.alt_text" placeholder="Mô tả ảnh (alt text)" class="w-full rounded-lg border-zinc-200 text-sm"/><div class="flex justify-between text-xs font-semibold"><button class="text-emerald-800" @click="saveAlt(item)">Lưu mô tả</button><button class="text-zinc-600" @click="copy(item.url)">Sao chép URL</button><button class="text-rose-600" @click="remove(item.id)">Xóa</button></div></div></article></div>
<div v-if="!media.data.length" class="rounded-lg border bg-white p-10 text-center text-zinc-500">Thư viện chưa có file.</div></div></AuthenticatedLayout></template>
