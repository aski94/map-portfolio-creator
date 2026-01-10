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
    align: 'left' | 'center' | 'right' | 'justify'
    gapHeadingText: number
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    marTop: number
    marRight: number
    marBottom: number
    marLeft: number
    textColor: string
    headingColor: string
    bgColor: string
}

const props = defineProps<{
    title: string
    text: string
    style?: Partial<TemplateStyle>
}>()

const s = computed<TemplateStyle>(() => ({
    align: props.style?.align ?? 'left',
    gapHeadingText: props.style?.gapHeadingText ?? 0,
    padTop: props.style?.padTop ?? 0,
    padRight: props.style?.padRight ?? 0,
    padBottom: props.style?.padBottom ?? 0,
    padLeft: props.style?.padLeft ?? 0,
    marTop: props.style?.marTop ?? 0,
    marRight: props.style?.marRight ?? 0,
    marBottom: props.style?.marBottom ?? 0,
    marLeft: props.style?.marLeft ?? 0,
    textColor: props.style?.textColor ?? '#111111',
    headingColor: props.style?.headingColor ?? '#000000',
    bgColor: props.style?.bgColor ?? 'transparent',
}))

const rootStyle = computed(() => ({
    padding: `${s.value.padTop}px ${s.value.padRight}px ${s.value.padBottom}px ${s.value.padLeft}px`,
    margin: `${s.value.marTop}px ${s.value.marRight}px ${s.value.marBottom}px ${s.value.marLeft}px`,
    textAlign: s.value.align,
    background: s.value.bgColor,
    borderRadius: 'var(--border-radius-secondary)',
}))

const headingStyle = computed(() => ({
    color: s.value.headingColor,
    marginBottom: `${s.value.gapHeadingText}px`,
}))

const textStyle = computed(() => ({
    color: s.value.textColor,
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
