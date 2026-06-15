<script setup>
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-[#FAF6EE] px-6 py-12 relative overflow-hidden font-sans">
        <!-- Background accents -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#043616]/5 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E5C44B]/10 blur-3xl pointer-events-none"></div>

        <div class="relative w-full max-w-md space-y-6">
            <!-- Brand Identity -->
            <div class="text-center space-y-3">
                <Link href="/" class="inline-flex items-center gap-2">
                    <span class="text-2xl font-bold font-serif text-[#043616]">Thảo Mộc Kiều Sang</span>
                </Link>
                <p class="text-xs font-semibold tracking-wider uppercase text-zinc-500">Đăng Nhập Quản Trị Viên</p>
            </div>

            <!-- Login form Card container -->
            <div class="overflow-hidden bg-[#FFFDF9] px-8 py-8 border border-zinc-200/80 rounded-xl">
                <slot />
            </div>
        </div>
    </div>
</template>
