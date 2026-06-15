<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    user: Object,
    availablePermissions: Object
});

const isEdit = ref(!!props.user);

const form = useForm({
    name: props.user?.name || '',
    email: props.user?.email || '',
    password: '',
    password_confirmation: '',
    role: props.user?.role || 'viewer',
    permissions: Array.isArray(props.user?.permissions) 
        ? props.user.permissions 
        : JSON.parse(props.user?.permissions || '[]'),
});

// Auto select permissions on role changes
watch(() => form.role, (newRole) => {
    if (newRole === 'super_admin') {
        form.permissions = Object.keys(props.availablePermissions);
    } else if (newRole === 'viewer') {
        form.permissions = [];
    } else if (newRole === 'editor' && !isEdit.value) {
        form.permissions = ['manage_products', 'manage_blogs', 'manage_categories'];
    }
});

const togglePermission = (key) => {
    if (form.role === 'super_admin' || form.role === 'viewer') return;
    
    const idx = form.permissions.indexOf(key);
    if (idx > -1) {
        form.permissions.splice(idx, 1);
    } else {
        form.permissions.push(key);
    }
};

const submit = () => {
    if (isEdit.value) {
        // We use PUT for normal updates without file uploads
        form.put(route('admin.users.update', props.user.id));
    } else {
        form.post(route('admin.users.store'));
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'CHỈNH SỬA TÀI KHOẢN NHÂN VIÊN' : 'TẠO MỚI TÀI KHOẢN NHÂN VIÊN' }}
                </h2>
                <Link
                    :href="route('admin.users.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="max-w-2xl mx-auto space-y-6">
            <!-- Validation Errors -->
            <div v-if="Object.keys(form.errors).length > 0" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
                <ul class="list-disc pl-5 space-y-1">
                    <li v-for="(error, key) in form.errors" :key="key">{{ error }}</li>
                </ul>
            </div>

            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <form @submit.prevent="submit" class="p-8 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Name -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Họ và tên *</label>
                            <input v-model="form.name" type="text" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Email -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Email đăng nhập *</label>
                            <input v-model="form.email" type="email" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Password -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">
                                Mật khẩu {{ isEdit ? '(để trống nếu không đổi)' : '*' }}
                            </label>
                            <input v-model="form.password" type="password" :required="!isEdit" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Password Confirmation -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Xác nhận mật khẩu</label>
                            <input v-model="form.password_confirmation" type="password" :required="!!form.password" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Role -->
                        <div class="flex flex-col space-y-2 col-span-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Vai trò / Cấp bậc *</label>
                            <select v-model="form.role" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="super_admin">Super Admin (Toàn bộ quyền hạn)</option>
                                <option value="editor">Biên tập viên (Quyền biên tập nội dung)</option>
                                <option value="viewer">Người xem (Chỉ xem dữ liệu, không thể sửa đổi)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Permissions Checklist -->
                    <div class="border-t border-zinc-100 pt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-sans font-bold text-[#043616] uppercase tracking-wider">
                                Phân quyền chi tiết (Permissions)
                            </h3>
                            <span v-if="form.role === 'super_admin'" class="text-xs text-rose-600 font-bold italic">
                                * Super Admin tự động có đầy đủ các quyền
                            </span>
                            <span v-else-if="form.role === 'viewer'" class="text-xs text-zinc-500 font-bold italic">
                                * Tài khoản Viewer chỉ có quyền đọc (không thể chọn quyền sửa đổi)
                            </span>
                        </div>

                        <div 
                            :class="[
                                (form.role === 'super_admin' || form.role === 'viewer') ? 'opacity-50 pointer-events-none' : '',
                                'grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#FAF6EE]/50 p-4 rounded-xl border border-zinc-200/50'
                            ]"
                        >
                            <div 
                                v-for="(label, key) in availablePermissions" 
                                :key="key"
                                @click="togglePermission(key)"
                                class="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-white hover:border-[#043616]/50 cursor-pointer select-none transition-all"
                            >
                                <div 
                                    :class="[
                                        form.permissions.includes(key)
                                            ? 'bg-[#043616] border-[#043616] text-[#FFFDF9]'
                                            : 'border-zinc-300 text-transparent',
                                        'w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 font-bold transition-all'
                                    ]"
                                >
                                    ✓
                                </div>
                                <span class="text-sm font-medium text-zinc-800">{{ label }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.users.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu nhân viên</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
