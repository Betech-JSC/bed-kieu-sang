<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    testimonials: Object,
    filters: Object
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');
const showModal = ref(false);
const isEditing = ref(false);

const form = useForm({
    id: null,
    customer_name: '',
    rating: 5,
    comment: '',
    is_featured: false,
    status: 'pending',
    avatar: null,
    customer_avatar: null
});

let debounceTimeout = null;
const handleFilterChange = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        router.get(route('admin.testimonials.index'), {
            search: search.value,
            status: status.value
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);
};

watch(search, handleFilterChange);
watch(status, () => {
    router.get(route('admin.testimonials.index'), {
        search: search.value,
        status: status.value
    }, {
        preserveState: true,
        replace: true
    });
});

const updateStatus = (id, status, isFeatured = false) => {
    router.patch(route('admin.testimonials.status', id), {
        status: status,
        is_featured: isFeatured
    });
};

const toggleFeatured = (testimonial) => {
    router.patch(route('admin.testimonials.status', testimonial.id), {
        status: testimonial.status,
        is_featured: !testimonial.is_featured
    });
};

const openCreateModal = () => {
    isEditing.value = false;
    form.reset();
    form.clearErrors();
    showModal.value = true;
};

const openEditModal = (item) => {
    isEditing.value = true;
    form.reset();
    form.clearErrors();
    form.id = item.id;
    form.customer_name = item.customer_name;
    form.rating = item.rating;
    form.comment = item.comment;
    form.is_featured = item.is_featured;
    form.status = item.status;
    form.customer_avatar = item.customer_avatar;
    form.avatar = null;
    showModal.value = true;
};

const handleFileChange = (e) => {
    form.avatar = e.target.files[0];
};

const submitForm = () => {
    if (isEditing.value) {
        form.post(route('admin.testimonials.update', form.id), {
            onSuccess: () => {
                showModal.value = false;
                form.reset();
            }
        });
    } else {
        form.post(route('admin.testimonials.store'), {
            onSuccess: () => {
                showModal.value = false;
                form.reset();
            }
        });
    }
};

const deleteItem = (id) => {
    if (confirm('Bạn có chắc chắn muốn xoá đánh giá này không?')) {
        router.delete(route('admin.testimonials.destroy', id));
    }
};
</script>

<template>
    <Head title="Quản lý đánh giá" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    QUẢN LÝ ĐÁNH GIÁ & NHẬN XÉT
                </h2>
                <button 
                    @click="openCreateModal"
                    class="px-4 py-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#032610] rounded-lg text-xs font-bold tracking-wide transition-colors"
                >
                    + THÊM ĐÁNH GIÁ
                </button>
            </div>
        </template>

        <div class="space-y-6">
            <!-- Filters & Search Bar -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#FFFDF9] p-4 rounded-xl border border-zinc-200/80">
                <div class="flex flex-wrap items-center gap-3">
                    <input 
                        v-model="search" 
                        type="text" 
                        placeholder="Tìm kiếm nhận xét..." 
                        class="w-64 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    />
                    <select 
                        v-model="status" 
                        class="w-48 border border-zinc-200 rounded-lg px-4 py-2 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none text-sm transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                    </select>
                </div>
            </div>

            <!-- Table System -->
            <div class="overflow-hidden bg-[#FFFDF9] rounded-xl border border-zinc-200/80">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm text-zinc-700">
                        <thead>
                            <tr class="bg-zinc-50 border-b border-zinc-200 text-[#043616] font-sans text-xs font-bold uppercase tracking-wider">
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-56">Khách hàng</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-48">Sản phẩm</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-24">Đánh giá</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60">Nội dung nhận xét</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-28">Nổi bật</th>
                                <th class="py-4 px-4 border-r border-zinc-200/60 w-32">Trạng thái</th>
                                <th class="py-4 px-4 w-40 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-200/80">
                            <tr 
                                v-for="item in testimonials.data" 
                                :key="item.id"
                                class="hover:bg-[#FAF6EE]/30 transition-colors"
                            >
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                            <img :src="item.customer_avatar || 'https://www.gravatar.com/avatar/?d=mp'" alt="Avatar" class="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div class="font-bold text-zinc-900 text-sm leading-tight">{{ item.customer_name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle font-medium text-zinc-700">
                                    {{ item.product?.name || 'Đánh giá chung' }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-amber-500 font-bold font-sans">
                                    ★ {{ item.rating }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle text-zinc-600 leading-relaxed text-xs">
                                    {{ item.comment }}
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <button 
                                        @click="toggleFeatured(item)"
                                        :class="item.is_featured 
                                            ? 'bg-[#E5C44B]/10 text-[#604b12] border-[#E5C44B]/30' 
                                            : 'bg-zinc-50 text-zinc-400 border-zinc-200'"
                                        class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all hover:shadow-xs"
                                    >
                                        {{ item.is_featured ? 'Nổi bật ★' : 'Thường' }}
                                    </button>
                                </td>
                                <td class="py-4 px-4 border-r border-zinc-200/60 align-middle">
                                    <span 
                                        :class="{
                                            'bg-emerald-50 text-emerald-800 border-emerald-200': item.status === 'approved',
                                            'bg-amber-50 text-amber-800 border-amber-200': item.status === 'pending',
                                            'bg-rose-50 text-rose-800 border-rose-200': item.status === 'rejected',
                                        }" 
                                        class="px-2.5 py-1 rounded-full text-xs font-bold border"
                                    >
                                        {{ item.status === 'approved' ? 'Đã duyệt' : item.status === 'pending' ? 'Chờ duyệt' : 'Từ chối' }}
                                    </span>
                                </td>
                                <td class="py-4 px-4 align-middle text-center w-40 whitespace-nowrap">
                                    <div class="flex items-center justify-center gap-2.5">
                                        <button 
                                            @click="openEditModal(item)"
                                            class="text-amber-700 hover:text-amber-900 font-bold text-xs uppercase tracking-wider"
                                            title="Sửa"
                                        >
                                            Sửa
                                        </button>
                                        <span class="text-zinc-350">|</span>
                                        <button 
                                            v-if="item.status !== 'approved'"
                                            @click="updateStatus(item.id, 'approved', item.is_featured)" 
                                            class="text-emerald-700 hover:text-emerald-900 font-bold text-xs uppercase tracking-wider"
                                        >
                                            Duyệt
                                        </button>
                                        <span v-if="item.status !== 'approved'" class="text-zinc-350">|</span>
                                        <button 
                                            @click="deleteItem(item.id)" 
                                            class="text-rose-600 hover:text-rose-800 font-bold text-xs uppercase tracking-wider"
                                            title="Xóa"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="testimonials.data.length === 0">
                                <td colspan="7" class="py-8 text-center text-zinc-500">
                                    Chưa nhận được đánh giá nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="testimonials.links && testimonials.total > testimonials.per_page" class="flex justify-between items-center p-6 border-t border-zinc-200/80">
                    <div class="text-xs text-zinc-500">
                        Hiển thị từ {{ testimonials.from || 0 }} đến {{ testimonials.to || 0 }} của {{ testimonials.total }} nhận xét
                    </div>
                    <div class="flex gap-1">
                        <Link
                            v-for="(link, idx) in testimonials.links"
                            :key="idx"
                            :href="link.url || '#'"
                            v-html="link.label"
                            :class="[
                                link.active ? 'bg-[#043616] text-[#FFFDF9] font-bold border border-[#043616]' : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200/80',
                                !link.url ? 'opacity-50 pointer-events-none' : '',
                                'px-3 py-1.5 rounded-lg text-xs transition-all duration-200'
                            ]"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Testimonial Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="bg-[#FFFDF9] rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="bg-[#043616] text-[#FFFDF9] px-6 py-4 flex justify-between items-center">
                    <h3 class="text-sm font-bold tracking-wide text-[#E5C44B] uppercase">
                        {{ isEditing ? 'Chỉnh Sửa Đánh Giá' : 'Thêm Đánh Giá Mới' }}
                    </h3>
                    <button @click="showModal = false" class="text-white/75 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Form Body -->
                <form @submit.prevent="submitForm" class="p-6 space-y-4 flex-1 overflow-y-auto">
                    <!-- Customer Name -->
                    <div>
                        <label class="block text-xs font-bold text-[#043616] uppercase tracking-wider mb-2">Tên khách hàng</label>
                        <input
                            v-model="form.customer_name"
                            type="text"
                            required
                            class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] outline-none text-sm transition-all"
                            placeholder="Nhập tên khách hàng..."
                        />
                        <div v-if="form.errors.customer_name" class="text-rose-600 text-xs mt-1">{{ form.errors.customer_name }}</div>
                    </div>

                    <!-- Customer Avatar File Upload -->
                    <div>
                        <label class="block text-xs font-bold text-[#043616] uppercase tracking-wider mb-2">Ảnh đại diện khách hàng</label>
                        <div class="flex items-center gap-4">
                            <!-- Avatar Preview -->
                            <div class="w-14 h-14 rounded-full overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0">
                                <img
                                    v-if="form.avatar"
                                    :src="URL.createObjectURL(form.avatar)"
                                    alt="Preview"
                                    class="w-full h-full object-cover"
                                />
                                <img
                                    v-else-if="form.customer_avatar"
                                    :src="form.customer_avatar"
                                    alt="Current Avatar"
                                    class="w-full h-full object-cover"
                                />
                                <svg v-else class="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <!-- File Input Button -->
                            <div class="flex-1">
                                <input
                                    type="file"
                                    ref="fileInput"
                                    @change="handleFileChange"
                                    accept="image/*"
                                    class="hidden"
                                />
                                <button
                                    type="button"
                                    @click="$refs.fileInput.click()"
                                    class="px-4 py-2 border border-zinc-200 hover:border-[#043616] rounded-lg text-xs font-bold text-zinc-700 hover:text-[#043616] bg-white hover:bg-[#FAF6EE]/20 transition-all shadow-xs"
                                >
                                    Chọn ảnh từ thiết bị
                                </button>
                                <p class="text-[10px] text-zinc-500 mt-1.5">Chấp nhận định dạng ảnh JPEG, PNG, JPG, WEBP tối đa 2MB</p>
                            </div>
                        </div>
                        <div v-if="form.errors.avatar" class="text-rose-600 text-xs mt-1">{{ form.errors.avatar }}</div>
                    </div>

                    <!-- Rating -->
                    <div>
                        <label class="block text-xs font-bold text-[#043616] uppercase tracking-wider mb-2">Đánh giá (Sao)</label>
                        <select
                            v-model="form.rating"
                            class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] outline-none text-sm transition-all"
                        >
                            <option :value="5">5 Sao (Rất tốt)</option>
                            <option :value="4">4 Sao (Khá tốt)</option>
                            <option :value="3">3 Sao (Bình thường)</option>
                            <option :value="2">2 Sao (Kém)</option>
                            <option :value="1">1 Sao (Rất kém)</option>
                        </select>
                        <div v-if="form.errors.rating" class="text-rose-600 text-xs mt-1">{{ form.errors.rating }}</div>
                    </div>

                    <!-- Comment -->
                    <div>
                        <label class="block text-xs font-bold text-[#043616] uppercase tracking-wider mb-2">Nội dung nhận xét</label>
                        <textarea
                            v-model="form.comment"
                            rows="4"
                            required
                            class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] outline-none text-sm transition-all resize-none"
                            placeholder="Nhập nhận xét của khách hàng..."
                        ></textarea>
                        <div v-if="form.errors.comment" class="text-rose-600 text-xs mt-1">{{ form.errors.comment }}</div>
                    </div>

                    <!-- Status and Featured Row -->
                    <div class="grid grid-cols-2 gap-4 pb-4">
                        <div>
                            <label class="block text-xs font-bold text-[#043616] uppercase tracking-wider mb-2">Trạng thái duyệt</label>
                            <select
                                v-model="form.status"
                                class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] outline-none text-sm transition-all"
                            >
                                <option value="pending">Chờ duyệt</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="rejected">Từ chối</option>
                            </select>
                            <div v-if="form.errors.status" class="text-rose-600 text-xs mt-1">{{ form.errors.status }}</div>
                        </div>
                        <div class="flex items-center pt-6">
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    v-model="form.is_featured"
                                    type="checkbox"
                                    class="w-4 h-4 text-[#043616] focus:ring-[#043616] border-zinc-300 rounded"
                                />
                                <span class="text-xs font-bold text-[#043616] uppercase tracking-wider">Đánh giá nổi bật</span>
                            </label>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                        <button
                            type="button"
                            @click="showModal = false"
                            class="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-700 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="px-5 py-2 bg-[#043616] text-[#FFFDF9] hover:bg-[#032610] disabled:opacity-50 rounded-lg text-xs font-bold tracking-wide transition-colors"
                        >
                            {{ form.processing ? 'Đang lưu...' : 'Lưu lại' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
