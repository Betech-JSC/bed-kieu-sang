<script setup>
import { onMounted, ref } from 'vue';

const model = defineModel({
    type: String,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <!-- label placeholder aria-label htmlFor -->
    <input
        class="rounded-lg border-zinc-200/80 focus:border-[#043616] focus:ring-1 focus:ring-[#043616] bg-white text-zinc-950 text-sm"
        v-model="model"
        ref="input"
    />
</template>
