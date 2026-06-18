<script setup>
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    canLogin: {
        type: Boolean,
    },
    canRegister: {
        type: Boolean,
    },
    laravelVersion: {
        type: String,
        required: true,
    },
    phpVersion: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <Head title="Chào mừng - Xông Nhà Tẩy Uế CMS" />
    
    <div class="relative flex min-h-screen flex-col items-center justify-center bg-[#FAF6EE] overflow-hidden">
        <!-- Botanical Decorative Background Elements -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#043616]/5 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E5C44B]/10 blur-3xl pointer-events-none"></div>

        <div class="relative w-full max-w-md px-6 py-12">
            <!-- Brand Identity -->
            <div class="text-center space-y-4 mb-8">
                <!-- Simple Elegant Leaf SVG Icon -->
                <div class="mx-auto w-16 h-16 bg-[#043616] text-[#FAF6EE] flex items-center justify-center rounded-2xl shadow-md border border-[#E5C44B]/20">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M12 3c4.5 0 9 4.5 9 9s-4.5 9-9 9M12 3C7.5 3 3 7.5 3 12s4.5 9 9 9" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold tracking-wide font-serif text-[#043616]">Xông Nhà Tẩy Uế</h1>
                    <p class="text-sm font-semibold tracking-wider uppercase text-zinc-500 mt-1">Hệ Thống Quản Trị CMS</p>
                </div>
            </div>

            <!-- Portal Center Card -->
            <div class="bg-[#FFFDF9] rounded-3xl p-8 border border-zinc-200/80 shadow-sm text-center space-y-6">
                <div class="space-y-2">
                    <h2 class="text-lg font-serif font-bold text-emerald-950">Chào mừng bạn trở lại</h2>
                    <p class="text-xs text-zinc-500 leading-relaxed">
                        Hệ thống quản lý sản phẩm, nội dung website và đơn đặt hàng Xông Nhà Tẩy Uế.
                    </p>
                </div>

                <!-- CTA Actions -->
                <div class="pt-2">
                    <!-- Logged In State -->
                    <div v-if="$page.props.auth.user" class="space-y-4">
                        <div class="text-sm text-zinc-700">
                            Xin chào, <span class="font-bold text-[#043616]">{{ $page.props.auth.user.name }}</span>
                        </div>
                        <Link
                            :href="route('admin.dashboard')"
                            class="block w-full text-center bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm"
                        >
                            Vào trang Dashboard
                        </Link>
                    </div>

                    <!-- Guest State -->
                    <div v-else class="space-y-3">
                        <Link
                            :href="route('login')"
                            class="block w-full text-center bg-[#043616] text-[#FFFDF9] hover:bg-[#112215] py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm"
                        >
                            Đăng nhập hệ thống
                        </Link>
                        <div class="text-[11px] text-zinc-400 font-medium pt-1">
                            Nếu chưa có tài khoản, vui lòng liên hệ kỹ thuật để được cấp quyền.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="mt-8 text-center text-xs text-zinc-400 font-sans">
                Laravel v{{ laravelVersion }} (PHP v{{ phpVersion }})
            </footer>
        </div>
    </div>
</template>
