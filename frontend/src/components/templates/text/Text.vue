<template>
    <section class="text" :style="rootStyle">
        <p class="heading" :style="headingStyle">
            {{ title }}
        </p>

        <p class="body" :style="textStyle">
            {{ text }}
        </p>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TemplateStyle = {
    align?: 'left' | 'center' | 'right' | 'justify'
    gapHeadingText?: number
    padTop?: number
    padRight?: number
    padBottom?: number
    padLeft?: number
    marTop?: number
    marRight?: number
    marBottom?: number
    marLeft?: number
    textColor?: string
    headingColor?: string
    bgColor?: string
}

const props = defineProps<{
    title: string
    text: string
    style?: TemplateStyle
}>()

const s = computed(() => props.style ?? {})

const rootStyle = computed(() => ({
    padding: `${s.value.padTop ?? 0}px ${s.value.padRight ?? 0}px ${s.value.padBottom ?? 0}px ${s.value.padLeft ?? 0}px`,
    margin: `${s.value.marTop ?? 0}px ${s.value.marRight ?? 0}px ${s.value.marBottom ?? 0}px ${s.value.marLeft ?? 0}px`,
    textAlign: s.value.align ?? 'left',
    background: s.value.bgColor ?? 'transparent',
    borderRadius: 'var(--border-radius-secondary)',
}))

const headingStyle = computed(() => ({
    ...(s.value.headingColor ? { color: s.value.headingColor } : {}),
    ...(s.value.gapHeadingText != null ? { marginBottom: `${s.value.gapHeadingText}px` } : {}),
}))

const textStyle = computed(() => ({
    ...(s.value.textColor ? { color: s.value.textColor } : {}),
}))
</script>

<style scoped lang="scss">
.text {
    width: 100%;
}

.heading {
    font-size: var(--heading-size);
    font-weight: 700;
}

.body {
    font-size: var(--text-size);
}
</style>
