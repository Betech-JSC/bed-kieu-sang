<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
const props = defineProps({ faq: Object });
const form = useForm({ question: props.faq?.question || '', answer: props.faq?.answer || '', sort_order: props.faq?.sort_order || 0, status: props.faq?.status || 'active' });
const submit = () => props.faq ? form.put(route('admin.faqs.update', props.faq.id)) : form.post(route('admin.faqs.store'));
</script>
<template><Head :title="faq ? 'Sửa FAQ' : 'Thêm FAQ'"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">{{ faq ? 'Sửa FAQ' : 'Thêm FAQ' }}</h2></template>
<form class="mx-auto max-w-3xl space-y-5 rounded-lg border border-zinc-200 bg-white p-7" @submit.prevent="submit">
  <div><label class="text-sm font-bold">Câu hỏi *</label><input v-model="form.question" required class="mt-2 w-full rounded-lg border-zinc-200"/><p class="text-xs text-rose-600">{{ form.errors.question }}</p></div>
  <div><label class="text-sm font-bold">Câu trả lời *</label><textarea v-model="form.answer" required rows="8" class="mt-2 w-full rounded-lg border-zinc-200"></textarea><p class="text-xs text-rose-600">{{ form.errors.answer }}</p></div>
  <div class="grid grid-cols-2 gap-4"><div><label class="text-sm font-bold">Thứ tự</label><input v-model="form.sort_order" type="number" min="0" class="mt-2 w-full rounded-lg border-zinc-200"/></div><div><label class="text-sm font-bold">Trạng thái</label><select v-model="form.status" class="mt-2 w-full rounded-lg border-zinc-200"><option value="active">Hiển thị</option><option value="inactive">Ẩn</option></select></div></div>
  <div class="flex justify-end gap-3"><Link :href="route('admin.faqs.index')" class="rounded-lg border px-5 py-2.5">Hủy</Link><button :disabled="form.processing" class="rounded-lg bg-[#043616] px-6 py-2.5 font-semibold text-white">Lưu FAQ</button></div>
</form></AuthenticatedLayout></template>
