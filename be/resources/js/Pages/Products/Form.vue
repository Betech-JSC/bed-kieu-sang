<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    product: Object,
    categories: Array,
    variantConfiguration: {
        type: Object,
        default: () => ({ has_variants: true, variants: [] })
    },
    media: {
        type: Array,
        default: () => []
    }
});

const isEdit = ref(!!props.product);

const imagePreview = ref('');
const isMediaModalOpen = ref(false);
const activeVariantIndex = ref(null);

const imageSourceType = ref(props.product?.image_path ? 'media' : 'upload');

watch(imageSourceType, (newVal) => {
    if (newVal === 'upload') {
        form.image_path = '';
    } else {
        form.image = null;
        imagePreview.value = '';
    }
});

const openMediaModal = (variantIndex = null) => {
    activeVariantIndex.value = variantIndex;
    isMediaModalOpen.value = true;
};
const closeMediaModal = () => {
    isMediaModalOpen.value = false;
};
const selectMediaImage = (url) => {
    if (activeVariantIndex.value === null) {
        form.image_path = url;
        form.image = null;
        imagePreview.value = '';
    } else {
        form.variants[activeVariantIndex.value].image_path = url;
        form.variants[activeVariantIndex.value].image = null;
    }
    closeMediaModal();
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.image = file;
        form.image_path = '';
        imagePreview.value = URL.createObjectURL(file);
    }
};

const form = useForm({
    category_id: props.product?.category_id || '',
    name: props.product?.name || '',
    slug: props.product?.slug || '',
    price: props.product?.price || 0,
    original_price: props.product?.original_price || '',
    description: props.product?.description || '',
    image_path: props.product?.image_path || '',
    image: null,
    benefits: props.product?.benefits || [],
    badge: props.product?.badge || '',
    channel_one_sales: props.product?.channel_one_sales || 0,
    channel_two_sales: props.product?.channel_two_sales || 0,
    virtual_sales: props.product?.virtual_sales || 0,
    real_sales: props.product?.real_sales || 0,
    is_best_seller: props.product?.is_best_seller || false,
    status: props.product?.status || 'active',
    seo_title: props.product?.seo_title || '',
    seo_desc: props.product?.seo_desc || '',
    has_variants: props.variantConfiguration?.has_variants ?? false,
    variants: (props.variantConfiguration?.variants || []).map((variant) => ({
        ...variant,
        image: null,
    })),
});

const slugify = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const addVariant = () => {
    const position = form.variants.length + 1;
    form.variants.push({
        name: '',
        sku: `${slugify(form.slug || form.name || 'san-pham').toUpperCase()}-${position}`,
        price: form.price || 0,
        original_price: form.original_price || '',
        image_path: '',
        image: null,
        stock: 0,
        status: 'active',
    });
};
const removeVariant = (index) => form.variants.splice(index, 1);
const handleVariantImage = (event, index) => {
    const file = event.target.files?.[0] || null;
    if (file) {
        form.variants[index].image = file;
        form.variants[index].image_path = '';
    }
};

const clearVariantImage = (index) => {
    form.variants[index].image = null;
    form.variants[index].image_path = '';
};

const getObjectURL = (file) => {
    return file ? URL.createObjectURL(file) : '';
};

const benefitInput = ref('');
const addBenefit = () => {
    if (benefitInput.value.trim() && !form.benefits.includes(benefitInput.value.trim())) {
        form.benefits.push(benefitInput.value.trim());
        benefitInput.value = '';
    }
};
const removeBenefit = (index) => {
    form.benefits.splice(index, 1);
};

// Auto-generate slug from name
const generateSlug = () => {
    if (!isEdit.value) {
        form.slug = form.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
};

const submit = () => {
    if (isEdit.value) {
        // Use POST with _method: 'PUT' for Inertia file upload compatibility on update
        form.transform((data) => ({
            ...data,
            _method: 'PUT'
        })).post(route('admin.products.update', props.product.id), { forceFormData: true });
    } else {
        form.post(route('admin.products.store'), { forceFormData: true });
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-lg font-bold uppercase tracking-wider text-emerald-950 font-sans">
                    {{ isEdit ? 'SỬA SẢN PHẨM THẢO MỘC' : 'THÊM SẢN PHẨM THẢO MỘC MỚI' }}
                </h2>
                <Link
                    :href="route('admin.products.index')"
                    class="text-zinc-600 hover:text-zinc-900 text-sm font-semibold transition-all duration-300"
                >
                    &larr; Quay lại danh sách
                </Link>
            </div>
        </template>

        <div class="max-w-4xl mx-auto space-y-6">
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
                            <label class="text-sm font-serif font-bold text-emerald-950">Tên sản phẩm *</label>
                            <input v-model="form.name" type="text" required @input="generateSlug" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Slug -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Slug (URL) *</label>
                            <input v-model="form.slug" type="text" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Category -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Danh mục sản phẩm *</label>
                            <select v-model="form.category_id" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="" disabled>Chọn danh mục</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                        </div>

                        <!-- Badge -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Nhãn (Badge - ví dụ: NEW, -15%)</label>
                            <input v-model="form.badge" type="text" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Price -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Giá bán (VNĐ) *</label>
                            <input v-model="form.price" type="number" required min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Original Price -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Giá gốc trước giảm (VNĐ, nếu có)</label>
                            <input v-model="form.original_price" type="number" min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                        </div>

                        <!-- Image Source Type Selection -->
                        <div class="flex flex-col space-y-2 col-span-1 md:col-span-2">
                            <label class="text-sm font-serif font-bold text-emerald-950 font-sans">Nguồn hình ảnh sản phẩm *</label>
                            <div class="flex items-center gap-6">
                                <label class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                                    <input type="radio" v-model="imageSourceType" value="upload" class="text-emerald-950 focus:ring-emerald-900 border-zinc-300" />
                                    Tải ảnh mới từ thiết bị
                                </label>
                                <label class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                                    <input type="radio" v-model="imageSourceType" value="media" class="text-[#043616] focus:ring-[#043616] border-zinc-300" />
                                    Chọn ảnh sẵn có từ thư viện Media
                                </label>
                            </div>
                        </div>

                        <!-- Image Display/Upload -->
                        <div class="flex flex-col space-y-2 col-span-1 md:col-span-2 border-t border-zinc-100 pt-4">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hình ảnh đại diện sản phẩm *</label>
                            
                            <!-- Case Upload -->
                            <div v-if="imageSourceType === 'upload'" class="flex items-start gap-4">
                                <div v-if="imagePreview" class="w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                    <img :src="imagePreview" alt="Xem trước" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 space-y-2">
                                    <input type="file" @change="handleImageChange" accept="image/*" class="text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                                    <p class="text-[10px] text-zinc-400">Chọn file ảnh chất lượng từ máy tính để tải lên.</p>
                                </div>
                            </div>
                            
                            <!-- Case Media -->
                            <div v-else-if="imageSourceType === 'media'" class="flex items-start gap-4">
                                <div v-if="form.image_path" class="w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                    <img :src="form.image_path" alt="Xem trước" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 space-y-2">
                                    <button type="button" @click="openMediaModal(null)" class="px-4 py-2 rounded-lg border border-[#043616] text-xs font-bold text-[#043616] hover:bg-emerald-50 transition-colors">
                                        Mở thư viện Media
                                    </button>
                                    <p v-if="form.image_path" class="text-[11px] text-emerald-750 truncate max-w-xs font-semibold">Ảnh đang chọn: {{ form.image_path.substring(form.image_path.lastIndexOf('/') + 1) }}</p>
                                    <p v-else class="text-[10px] text-zinc-400">Chưa chọn ảnh nào từ thư viện Media.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Trạng thái bán *</label>
                            <select v-model="form.status" required class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all">
                                <option value="active">Đang kinh doanh</option>
                                <option value="inactive">Tạm ngưng / Nháp</option>
                            </select>
                        </div>
                    </div>

                    <div class="border-t border-zinc-100 pt-6 space-y-5">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Phân loại sản phẩm</h3>
                                <p class="text-xs text-zinc-500 mt-1">Chọn xem sản phẩm này có nhiều biến thể/phân loại khác nhau hay không.</p>
                            </div>
                            <div class="flex items-center space-x-2.5 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5">
                                <input type="checkbox" id="has_variants" v-model="form.has_variants" class="rounded text-[#043616] focus:ring-[#043616] w-4.5 h-4.5 cursor-pointer" />
                                <label for="has_variants" class="text-xs font-bold text-emerald-950 cursor-pointer select-none">Sản phẩm có phân loại</label>
                            </div>
                        </div>

                        <div v-if="form.has_variants" class="rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h4 class="text-sm font-bold text-emerald-950">Danh sách phân loại</h4>
                                        <p class="text-xs text-zinc-500 mt-1">Giá giảm được thể hiện bằng “Giá gốc” cao hơn “Giá bán”.</p>
                                    </div>
                                    <button type="button" @click="addVariant" class="px-4 py-2 rounded-lg bg-[#043616] text-white text-xs font-bold hover:bg-[#112215]">+ Thêm phân loại</button>
                                </div>

                                <div v-if="form.variants.length === 0" class="rounded-lg border border-dashed border-zinc-300 p-5 text-center text-xs text-zinc-500">
                                    Chưa có phân loại. Nhấn “Thêm phân loại” để bắt đầu.
                                </div>

                                <div v-else class="overflow-x-auto border border-zinc-200 rounded-lg">
                                    <table class="min-w-[1120px] w-full text-xs">
                                        <thead class="bg-zinc-50 text-emerald-950 uppercase tracking-wider">
                                            <tr>
                                                <th class="p-3 text-left">Phân loại</th>
                                                <th class="p-3 text-left w-40">SKU</th>
                                                <th class="p-3 text-left w-32">Giá bán</th>
                                                <th class="p-3 text-left w-32">Giá gốc</th>
                                                <th class="p-3 text-left w-24">Tồn kho</th>
                                                <th class="p-3 text-left w-32">Trạng thái</th>
                                                <th class="p-3 text-left w-60">Ảnh riêng</th>
                                                <th class="p-3 text-center w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-zinc-100">
                                            <tr v-for="(variant, variantIndex) in form.variants" :key="variantIndex" class="align-top">
                                                <td class="p-2"><input v-model="variant.name" required placeholder="Ví dụ: Hộp 20 gói" class="w-full border border-zinc-200 rounded-md px-2 py-2" /></td>
                                                <td class="p-2"><input v-model="variant.sku" required class="w-full border border-zinc-200 rounded-md px-2 py-2" /></td>
                                                <td class="p-2"><input v-model="variant.price" type="number" min="0" required class="w-full border border-zinc-200 rounded-md px-2 py-2" /></td>
                                                <td class="p-2"><input v-model="variant.original_price" type="number" min="0" class="w-full border border-zinc-200 rounded-md px-2 py-2" /></td>
                                                <td class="p-2"><input v-model="variant.stock" type="number" min="0" required class="w-full border border-zinc-200 rounded-md px-2 py-2" /></td>
                                                <td class="p-2">
                                                    <select v-model="variant.status" class="w-full border border-zinc-200 rounded-md px-2 py-2 bg-white">
                                                        <option value="active">Đang bán</option>
                                                        <option value="inactive">Tạm ẩn</option>
                                                    </select>
                                                </td>
                                                <td class="p-2">
                                                    <div class="flex items-center gap-2">
                                                        <div v-if="variant.image_path || variant.image" class="w-10 h-10 rounded border border-zinc-200 overflow-hidden shrink-0 bg-zinc-50 flex items-center justify-center">
                                                            <img :src="variant.image ? getObjectURL(variant.image) : variant.image_path" class="w-full h-full object-cover" />
                                                        </div>
                                                        <div class="flex flex-col gap-1 flex-1 min-w-0">
                                                            <input type="file" accept="image/*" @change="handleVariantImage($event, variantIndex)" class="w-full text-[10px] file:mr-1 file:rounded file:border-0 file:bg-emerald-50 file:px-1.5 file:py-1 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer" />
                                                            <div class="flex items-center gap-1.5 text-[9px] font-bold mt-0.5">
                                                                <button type="button" @click="openMediaModal(variantIndex)" class="text-emerald-700 hover:text-emerald-950 underline">
                                                                    Chọn từ Media
                                                                </button>
                                                                <span v-if="variant.image_path || variant.image" class="text-zinc-300">|</span>
                                                                <button v-if="variant.image_path || variant.image" type="button" @click="clearVariantImage(variantIndex)" class="text-rose-600 hover:text-rose-800">
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="p-2 text-center"><button type="button" @click="removeVariant(variantIndex)" class="px-2 py-2 text-rose-700 font-bold hover:bg-rose-50 rounded">Xoá</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="text-[11px] text-zinc-500">Khi lưu, giá hiển thị ngoài danh sách tự lấy mức thấp nhất trong các phân loại đang bán.</p>
                        </div>
                    </div>

                    <div class="border-t border-zinc-100 pt-6 space-y-4">
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Cấu hình lượt bán</h3>
                                <p class="text-xs text-zinc-500 mt-1">Tổng hiển thị = Kênh 1 + Kênh 2 + Số cấu hình + Đơn hàng trên website.</p>
                            </div>
                            <label class="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                                <input v-model="form.is_best_seller" type="checkbox" class="rounded border-emerald-300 text-[#043616] focus:ring-[#043616]" />
                                Ghim vào Sản Phẩm Bán Chạy
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Kênh 1 / Website</label>
                                <input v-model="form.channel_one_sales" type="number" min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Kênh 2 / Sàn TMĐT</label>
                                <input v-model="form.channel_two_sales" type="number" min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Số bán cấu hình</label>
                                <input v-model="form.virtual_sales" type="number" min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Đơn hàng hệ thống</label>
                                <input v-model="form.real_sales" type="number" min="0" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Mô tả sản phẩm *</label>
                        <textarea v-model="form.description" required rows="4" class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"></textarea>
                    </div>

                    <!-- Benefits -->
                    <div class="flex flex-col space-y-2">
                        <label class="text-sm font-serif font-bold text-emerald-950">Lợi ích sản phẩm (Benefits)</label>
                        <div class="flex gap-2">
                            <input v-model="benefitInput" type="text" placeholder="Nhập lợi ích..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all flex-1" />
                            <button type="button" @click="addBenefit" class="bg-[#043616] text-[#FFFDF9] px-6 rounded-lg hover:bg-[#112215] transition-all">Thêm</button>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <span v-for="(benefit, idx) in form.benefits" :key="idx" class="bg-emerald-100 text-[#043616] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/50">
                                {{ benefit }}
                                <button type="button" @click="removeBenefit(idx)" class="text-rose-600 font-bold hover:text-rose-800">&times;</button>
                            </span>
                        </div>
                    </div>

                    <!-- Cấu hình SEO -->
                    <div class="border-t border-zinc-100 pt-6 space-y-4">
                        <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Cấu hình SEO cho trang</h3>
                        <div class="grid grid-cols-1 gap-4">
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Tiêu đề SEO (SEO Title)</label>
                                <input v-model="form.seo_title" type="text" placeholder="Để trống sẽ tự động lấy tên sản phẩm..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all" />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm font-serif font-bold text-emerald-950">Mô tả SEO (SEO Meta Description)</label>
                                <textarea v-model="form.seo_desc" rows="3" placeholder="Để trống sẽ tự động trích xuất từ mô tả sản phẩm..." class="border border-zinc-200 rounded-lg px-4 py-2.5 bg-white text-zinc-950 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] outline-none transition-all"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-zinc-100">
                        <Link :href="route('admin.products.index')" class="px-6 py-2.5 border border-zinc-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-all">Huỷ</Link>
                        <button type="submit" :disabled="form.processing" class="px-8 py-2.5 bg-[#043616] text-[#FFFDF9] rounded-lg text-sm font-semibold hover:bg-[#112215] transition-all disabled:opacity-50">Lưu sản phẩm</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Media Library Selector Modal -->
        <div v-if="isMediaModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
            <div class="bg-white rounded-xl border border-zinc-200 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                <div class="p-5 border-b border-zinc-100 flex justify-between items-center">
                    <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Chọn ảnh từ thư viện Media</h3>
                    <button type="button" @click="closeMediaModal" class="text-zinc-400 hover:text-zinc-600 font-bold text-xl">&times;</button>
                </div>
                
                <div class="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div v-for="item in props.media" :key="item.id" @click="selectMediaImage(item.url)" class="group cursor-pointer border border-zinc-200 rounded-lg overflow-hidden hover:border-[#043616] hover:shadow-md transition-all duration-300">
                        <div class="aspect-square bg-zinc-50 overflow-hidden">
                            <img :src="item.url" :alt="item.alt_text || item.original_name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div class="p-2 border-t border-zinc-100 bg-zinc-50 group-hover:bg-emerald-50 transition-colors">
                            <p class="text-[10px] font-semibold text-zinc-700 truncate" :title="item.original_name">{{ item.original_name }}</p>
                        </div>
                    </div>
                    <div v-if="!props.media.length" class="col-span-full py-12 text-center text-sm text-zinc-500">
                        Thư viện media trống. Hãy tải ảnh lên trước ở trang Media.
                    </div>
                </div>
                
                <div class="p-4 border-t border-zinc-100 flex justify-end">
                    <button type="button" @click="closeMediaModal" class="px-5 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">Đóng</button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
