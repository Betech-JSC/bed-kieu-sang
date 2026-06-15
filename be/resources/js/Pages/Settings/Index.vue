<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({
    settings: Object
});

const settingLabels = {
    'store_hotline': 'Hotline cửa hàng',
    'store_email': 'Email liên hệ',
    'store_address': 'Địa chỉ cửa hàng (chân trang)',
    'meta_title': 'Meta Title mặc định (Tiêu đề trang chủ)',
    'meta_desc': 'Meta Description mặc định (Mô tả trang chủ)',
    'meta_keywords': 'Meta Keywords mặc định (Từ khóa mặc định)',
};

// Flatten grouped settings into a list for the form payload
const getSettingsPayload = () => {
    const list = [];
    Object.values(props.settings).forEach(groupItems => {
        groupItems.forEach(item => {
            list.push({
                key: item.key,
                value: item.value || ''
            });
        });
    });
    return list;
};

const form = useForm({
    settings: getSettingsPayload()
});

const submit = () => {
    form.post(route('admin.settings.update'));
};
</script>

<template>
    <Head title="Cấu hình hệ thống" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    CẤU HÌNH CHUNG HỆ THỐNG
                </h2>
            </div>
        </template>

        <div class="max-w-3xl mx-auto space-y-6">
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <form @submit.prevent="submit" class="p-8 space-y-8">
                    <div class="space-y-8">
                        <!-- Group sections -->
                        <div v-for="(items, groupName) in settings" :key="groupName" class="space-y-4">
                            <h3 class="text-sm font-sans font-bold text-[#043616] uppercase border-b border-zinc-200/80 pb-2.5 tracking-wider">
                                {{ groupName === 'contact' ? 'Thông tin liên hệ cửa hàng' : (groupName === 'seo' ? 'Cấu hình SEO toàn cục (Mặc định)' : groupName) }}
                            </h3>

                            <div class="grid grid-cols-1 gap-4">
                                <div 
                                    v-for="item in form.settings.filter(s => items.some(i => i.key === s.key))" 
                                    :key="item.key"
                                    class="flex flex-col space-y-2"
                                >
                                    <label class="text-sm font-serif font-bold text-emerald-950">
                                        {{ settingLabels[item.key] || item.key }}
                                    </label>
                                    <textarea 
                                        v-if="item.key === 'meta_desc' || item.key === 'store_address'"
                                        v-model="item.value" 
                                        rows="3"
                                        class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm" 
                                    ></textarea>
                                    <input 
                                        v-else
                                        v-model="item.value" 
                                        type="text" 
                                        class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all text-sm" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end pt-4 border-t border-zinc-150">
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-bold hover:bg-[#112215] transition-all disabled:opacity-50 hover:shadow-sm">
                            Lưu cấu hình
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

