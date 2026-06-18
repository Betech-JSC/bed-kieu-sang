<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
const props = defineProps({ questions: Object, filters: Object });
const status = ref(props.filters?.status || '');
const filter = () => router.get(route('admin.product-questions.index'), { status: status.value }, { preserveState: true });
const save = (item) => useForm({ answer: item.answer || '', status: item.status }).put(route('admin.product-questions.update', item.id));
const remove = (id) => confirm('Xóa câu hỏi này?') && router.delete(route('admin.product-questions.destroy', id));
</script>
<template><Head title="Hỏi đáp sản phẩm"/><AuthenticatedLayout><template #header><h2 class="text-lg font-bold uppercase text-emerald-950">Hỏi đáp sản phẩm</h2></template>
<div class="space-y-5"><select v-model="status" class="rounded-lg border-zinc-200" @change="filter"><option value="">Tất cả trạng thái</option><option value="pending">Chờ xử lý</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select>
<div v-for="item in questions.data" :key="item.id" class="rounded-lg border border-zinc-200 bg-white p-6"><div class="flex flex-wrap justify-between gap-2"><div><strong>{{ item.product?.name }}</strong><p class="text-xs text-zinc-500">{{ item.customer_name }} · {{ item.customer_email || 'Không có email' }}</p></div><button class="text-sm font-semibold text-rose-600" @click="remove(item.id)">Xóa</button></div><p class="mt-4 rounded-lg bg-zinc-50 p-4 text-sm">{{ item.question }}</p><textarea v-model="item.answer" rows="3" placeholder="Nhập câu trả lời..." class="mt-4 w-full rounded-lg border-zinc-200"></textarea><div class="mt-3 flex justify-end gap-3"><select v-model="item.status" class="rounded-lg border-zinc-200"><option value="pending">Chờ xử lý</option><option value="approved">Duyệt công khai</option><option value="rejected">Từ chối</option></select><button class="rounded-lg bg-[#043616] px-5 py-2 text-sm font-semibold text-white" @click="save(item)">Lưu phản hồi</button></div></div>
<div v-if="!questions.data.length" class="rounded-lg border bg-white p-10 text-center text-zinc-500">Chưa có câu hỏi sản phẩm.</div></div></AuthenticatedLayout></template>
