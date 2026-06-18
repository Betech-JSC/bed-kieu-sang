<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
defineProps({ faqs: Object });
const remove = (id) => confirm('Xóa FAQ này?') && router.delete(route('admin.faqs.destroy', id));
</script>
<template>
  <Head title="Quản lý FAQ" />
  <AuthenticatedLayout>
    <template #header><h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950">Hỏi đáp FAQ</h2></template>
    <div class="space-y-5">
      <div class="flex justify-end"><Link :href="route('admin.faqs.create')" class="rounded-lg bg-[#043616] px-5 py-2.5 text-sm font-semibold text-white">Thêm FAQ</Link></div>
      <div class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table class="w-full text-left text-sm"><thead class="bg-zinc-50 text-xs uppercase text-emerald-950"><tr><th class="p-4">Câu hỏi</th><th class="p-4 w-24">Thứ tự</th><th class="p-4 w-28">Trạng thái</th><th class="p-4 w-32">Thao tác</th></tr></thead>
        <tbody class="divide-y divide-zinc-100"><tr v-for="faq in faqs.data" :key="faq.id"><td class="p-4"><strong>{{ faq.question }}</strong><p class="mt-1 line-clamp-2 text-xs text-zinc-500">{{ faq.answer }}</p></td><td class="p-4">{{ faq.sort_order }}</td><td class="p-4">{{ faq.status === 'active' ? 'Hiển thị' : 'Đang ẩn' }}</td><td class="p-4"><Link :href="route('admin.faqs.edit', faq.id)" class="font-semibold text-emerald-800">Sửa</Link><button class="ml-4 font-semibold text-rose-600" @click="remove(faq.id)">Xóa</button></td></tr><tr v-if="!faqs.data.length"><td colspan="4" class="p-10 text-center text-zinc-500">Chưa có FAQ.</td></tr></tbody></table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
