<script setup>
import { ref, watch, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const showingSidebarMobile = ref(false);
const page = usePage();

const toast = ref({ show: false, message: '', type: 'success' });
let toastTimeout = null;

const showToast = (message, type) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.value = { show: true, message, type };
    toastTimeout = setTimeout(() => {
        toast.value.show = false;
    }, 4000);
};

watch(
    () => page.props.flash,
    (flash) => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        } else if (flash?.error) {
            showToast(flash.error, 'error');
        }
    },
    { deep: true, immediate: true }
);

const closeToast = () => {
    toast.value.show = false;
    if (toastTimeout) clearTimeout(toastTimeout);
};

const navigationItems = [
    { name: 'Tổng quan', routeName: 'admin.dashboard', activePattern: 'admin.dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Sản phẩm', routeName: 'admin.products.index', activePattern: 'admin.products.*', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Danh mục', routeName: 'admin.categories.index', activePattern: 'admin.categories.*', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { name: 'Bài viết (Blogs)', routeName: 'admin.blogs.index', activePattern: 'admin.blogs.*', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { name: 'Banner / Slide', routeName: 'admin.banners.index', activePattern: 'admin.banners.*', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', permission: 'manage_banners' },
    { name: 'Hỏi đáp FAQ', routeName: 'admin.faqs.index', activePattern: 'admin.faqs.*', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907C12.278 13.045 12 13.5 12 14m0 4h.01', permission: 'manage_faqs' },
    { name: 'Hỏi đáp sản phẩm', routeName: 'admin.product-questions.index', activePattern: 'admin.product-questions.*', icon: 'M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', permission: 'manage_product_questions' },
    { name: 'Thư viện media', routeName: 'admin.media.index', activePattern: 'admin.media.*', icon: 'M3 7h5l2-2h4l2 2h5v12H3V7zm9 3a3 3 0 100 6 3 3 0 000-6z', permission: 'manage_media' },
    { name: 'Trang tĩnh', routeName: 'admin.pages.index', activePattern: 'admin.pages.*', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', permission: 'manage_pages' },
    { name: 'Đánh giá (Reviews)', routeName: 'admin.testimonials.index', activePattern: 'admin.testimonials.*', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { name: 'Đơn đặt hàng', routeName: 'admin.orders.index', activePattern: 'admin.orders.*', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Hộp thư liên hệ', routeName: 'admin.contacts.index', activePattern: 'admin.contacts.*', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'SEO Redirects', routeName: 'admin.seo-redirects.index', activePattern: 'admin.seo-redirects.*', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', permission: 'manage_settings' },
    { name: 'Cấu hình chung', routeName: 'admin.settings.index', activePattern: 'admin.settings.*', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', permission: 'manage_settings' },
    { name: 'Hướng dẫn sử dụng', routeName: 'admin.guide', activePattern: 'admin.guide', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253' },
    { name: 'Nhân viên & Quyền', routeName: 'admin.users.index', activePattern: 'admin.users.*', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z', permission: 'manage_users' },
    { name: 'Vai trò & Phân quyền', routeName: 'admin.roles.index', activePattern: 'admin.roles.*', icon: 'M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v8m-4-4h8', permission: 'manage_roles' },
    { name: 'Lịch sử hoạt động', routeName: 'admin.activity-logs.index', activePattern: 'admin.activity-logs.*', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', permission: 'view_activity_logs' },
];

const viewPermissions = {
    'admin.products.index': 'view_products',
    'admin.categories.index': 'view_categories',
    'admin.blogs.index': 'view_blogs',
    'admin.pages.index': 'view_pages',
    'admin.banners.index': 'view_banners',
    'admin.faqs.index': 'view_faqs',
    'admin.product-questions.index': 'view_product_questions',
    'admin.media.index': 'view_media',
    'admin.testimonials.index': 'view_reviews',
    'admin.orders.index': 'view_orders',
    'admin.contacts.index': 'view_contacts',
    'admin.settings.index': 'view_settings',
    'admin.users.index': 'view_users',
    'admin.roles.index': 'view_roles',
};

const filteredNavigationItems = computed(() => {
    const user = page.props.auth.user;
    if (!user) return [];

    if (user.role === 'super_admin') {
        return navigationItems;
    }

    const rolePermissions = user.role_model?.permissions?.map(permission => permission.key) || [];
    const legacyPermissions = Array.isArray(user.permissions)
        ? user.permissions
        : JSON.parse(user.permissions || '[]');
    const userPermissions = [...new Set([...rolePermissions, ...legacyPermissions])];

    return navigationItems.filter(item => {
        const requiredPermission = viewPermissions[item.routeName] || item.permission;
        if (!requiredPermission) return true;
        return userPermissions.includes(requiredPermission);
    });
});
</script>

<template>
    <div class="h-screen flex bg-[#FAF6EE] font-sans overflow-hidden">
        <!-- Desktop Sidebar -->
        <aside class="hidden lg:flex flex-col w-64 h-screen bg-[#043616] text-[#FFFDF9] border-r border-[#FAF6EE]/10 shrink-0 justify-between">
            <div class="flex flex-col flex-1 min-h-0">
                <!-- Sidebar Header -->
                <div class="h-16 flex items-center px-6 border-b border-[#FAF6EE]/10 bg-[#021f0c]/30 shrink-0">
                    <Link :href="route('admin.dashboard')" class="flex items-center gap-3">
                        <span class="text-lg font-serif font-bold tracking-wide text-[#E5C44B]">Xông Nhà Tẩy Uế CMS</span>
                    </Link>
                </div>

                <!-- Navigation Links -->
                <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    <Link
                        v-for="item in filteredNavigationItems"
                        :key="item.name"
                        :href="route(item.routeName)"
                        :class="[
                            route().current(item.activePattern)
                                ? 'bg-[#FAF6EE]/15 text-[#E5C44B] font-semibold border-l-4 border-[#E5C44B] px-3'
                                : 'text-[#FAF6EE]/75 hover:bg-[#FAF6EE]/5 hover:text-[#FFFDF9] border-l-4 border-transparent px-3',
                            'flex items-center py-2.5 rounded-r-lg text-sm transition-all duration-200 group'
                        ]"
                    >
                        <svg
                            class="w-5 h-5 mr-3 shrink-0 transition-opacity duration-200"
                            :class="route().current(item.activePattern) ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                        </svg>
                        {{ item.name }}
                    </Link>
                </nav>
            </div>

            <!-- Sidebar Footer User Profile -->
            <div class="p-4 border-t border-[#FAF6EE]/10 bg-[#021f0c]/20 shrink-0">
                <div class="flex items-center justify-between">
                    <div class="truncate mr-2">
                        <p class="text-sm font-semibold text-[#FFFDF9] truncate">{{ $page.props.auth.user.name }}</p>
                        <p class="text-xs text-[#FAF6EE]/65 truncate">{{ $page.props.auth.user.email }}</p>
                    </div>
                    <Link
                        :href="route('logout')"
                        method="post"
                        as="button"
                        class="p-1.5 text-[#FAF6EE]/60 hover:text-rose-400 hover:bg-[#FAF6EE]/5 rounded-lg transition-colors"
                        title="Đăng xuất"
                    >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </Link>
                </div>
            </div>
        </aside>

        <!-- Mobile Layout Wrapper & Main Wrapper -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
            <!-- Mobile Header Topbar -->
            <header class="lg:hidden h-16 flex items-center justify-between px-6 bg-[#043616] text-[#FFFDF9] border-b border-[#FAF6EE]/10 shrink-0">
                <span class="text-lg font-serif font-bold tracking-wide text-[#E5C44B]">Xông Nhà Tẩy Uế CMS</span>
                <button
                    @click="showingSidebarMobile = !showingSidebarMobile"
                    class="p-2 text-[#FAF6EE] hover:bg-[#FAF6EE]/10 rounded-lg focus:outline-none"
                >
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            <!-- Mobile Drawer Overlay -->
            <div
                v-if="showingSidebarMobile"
                class="lg:hidden fixed inset-0 z-40 bg-zinc-900/60 transition-opacity duration-300"
                @click="showingSidebarMobile = false"
            ></div>

            <!-- Mobile Drawer Sidebar -->
            <aside
                :class="[
                    showingSidebarMobile ? 'translate-x-0' : '-translate-x-full',
                    'fixed inset-y-0 left-0 z-50 w-64 bg-[#043616] text-[#FFFDF9] flex flex-col transition-transform duration-300 ease-in-out lg:hidden justify-between'
                ]"
            >
                <div class="flex flex-col flex-1 min-h-0">
                    <div class="h-16 flex items-center justify-between px-6 border-b border-[#FAF6EE]/10 bg-[#021f0c]/30 shrink-0">
                        <span class="text-lg font-serif font-bold tracking-wide text-[#E5C44B]">Xông Nhà Tẩy Uế CMS</span>
                        <button
                            @click="showingSidebarMobile = false"
                            class="p-2 text-[#FAF6EE]/70 hover:text-white rounded-lg focus:outline-none"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        <Link
                            v-for="item in filteredNavigationItems"
                            :key="item.name"
                            :href="route(item.routeName)"
                            @click="showingSidebarMobile = false"
                            :class="[
                                route().current(item.activePattern)
                                    ? 'bg-[#FAF6EE]/15 text-[#E5C44B] font-semibold border-l-4 border-[#E5C44B] px-3'
                                    : 'text-[#FAF6EE]/75 hover:bg-[#FAF6EE]/5 hover:text-[#FFFDF9] border-l-4 border-transparent px-3',
                                'flex items-center py-2.5 rounded-r-lg text-sm transition-all duration-200'
                            ]"
                        >
                            <svg class="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                            </svg>
                            {{ item.name }}
                        </Link>
                    </nav>
                </div>
                <div class="p-4 border-t border-[#FAF6EE]/10 bg-[#021f0c]/20 shrink-0">
                    <div class="flex items-center justify-between">
                        <div class="truncate mr-2">
                            <p class="text-sm font-semibold text-[#FFFDF9] truncate">{{ $page.props.auth.user.name }}</p>
                            <p class="text-xs text-[#FAF6EE]/65 truncate">{{ $page.props.auth.user.email }}</p>
                        </div>
                        <Link
                            :href="route('logout')"
                            method="post"
                            as="button"
                            class="p-1.5 text-[#FAF6EE]/60 hover:text-rose-400 hover:bg-[#FAF6EE]/5 rounded-lg transition-colors"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            <!-- Main Top Bar (Desktop Only) -->
            <header class="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-zinc-200/80 shrink-0">
                <div class="flex items-center">
                    <slot name="header" />
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <span class="text-sm font-semibold text-[#043616]">{{ $page.props.auth.user.name }}</span>
                        <span class="block text-[11px] text-zinc-500 font-bold tracking-wide uppercase">{{ $page.props.auth.user.role === 'super_admin' ? 'Super Admin' : ($page.props.auth.user.role === 'editor' ? 'Biên tập viên' : 'Người xem') }}</span>
                    </div>
                </div>
            </header>

            <!-- Scrollable Main -->
            <main class="flex-1 overflow-y-auto p-8 bg-[#FAF6EE]">
                <!-- Toast Notification System -->
                <div 
                    v-if="toast.show" 
                    :class="[
                        toast.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800',
                        'mb-6 p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-300'
                    ]"
                >
                    <div class="flex items-center gap-3">
                        <span v-if="toast.type === 'success'" class="text-emerald-600">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <span v-else class="text-rose-600">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <span class="text-sm font-medium">{{ toast.message }}</span>
                    </div>
                    <button @click="closeToast" class="p-1 hover:bg-black/5 rounded-lg transition-colors ml-4 text-zinc-500 hover:text-zinc-800">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <slot />
            </main>
        </div>
    </div>
</template>
