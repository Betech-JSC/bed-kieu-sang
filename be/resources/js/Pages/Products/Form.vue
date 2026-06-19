<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    product: Object,
    categories: Array,
    variantConfiguration: {
        type: Object,
        default: () => ({ has_variants: true, variants: [] })
    }
});

const isEdit = ref(!!props.product);

const imagePreview = ref('');
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.image = file;
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
    has_variants: true,
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
    form.variants[index].image = event.target.files?.[0] || null;
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

                        <!-- Image Upload -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-serif font-bold text-emerald-950">Hình ảnh sản phẩm *</label>
                            <div class="flex items-center gap-4">
                                <div v-if="imagePreview || form.image_path" class="w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 flex items-center justify-center">
                                    <img :src="imagePreview || form.image_path" alt="Xem trước" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1">
                                    <input type="file" @change="handleImageChange" accept="image/*" class="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
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
                        <div>
                            <div>
                                <h3 class="text-md font-serif font-bold text-emerald-950 uppercase tracking-wider">Phân loại sản phẩm</h3>
                                <p class="text-xs text-zinc-500 mt-1">Phân loại được bật sẵn. Thêm từng lựa chọn như trên Shopee; mỗi phân loại có giá bán, giá gốc/giảm giá, SKU, ảnh và tồn kho riêng.</p>
                            </div>
                        </div>

                        <div class="rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
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
                                                <th class="p-3 text-left w-48">Ảnh riêng</th>
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
                                                    <div v-if="variant.image_path" class="text-[10px] text-emerald-700 mb-1 truncate max-w-40">Đã có ảnh riêng</div>
                                                    <input type="file" accept="image/*" @change="handleVariantImage($event, variantIndex)" class="w-full text-[10px] file:mr-2 file:rounded file:border-0 file:bg-emerald-50 file:px-2 file:py-1.5 file:text-emerald-800" />
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
    </AuthenticatedLayout>
</template>
