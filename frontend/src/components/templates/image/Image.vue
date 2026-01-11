<template>
    <section class="wrap" :style="rootStyle">
        <figure class="figure" :class="alignClass">
            <img v-if="src" class="img" :src="src" :alt="alt" :style="imgStyle" />

            <div v-else class="img placeholder" :style="imgStyle">
                <span class="placeholder-text">Select an image in the styling section</span>
            </div>

            <p v-if="caption" class="caption">{{ caption }}</p>
        </figure>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ImageStyle = {
    align: 'left' | 'center' | 'right'
    widthPct: number
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
}

const props = defineProps<{
    src: string
    alt?: string
    caption?: string
    style?: Partial<ImageStyle>
}>()

const s = computed<ImageStyle>(() => ({
    align: props.style?.align ?? 'left',
    widthPct: props.style?.widthPct ?? 25,
    padTop: props.style?.padTop ?? 0,
    padRight: props.style?.padRight ?? 0,
    padBottom: props.style?.padBottom ?? 0,
    padLeft: props.style?.padLeft ?? 0,
}))

const rootStyle = computed(() => ({
    padding: `${s.value.padTop}px ${s.value.padRight}px ${s.value.padBottom}px ${s.value.padLeft}px`,
}))

const imgStyle = computed(() => ({
    width: `${s.value.widthPct}%`,
}))

const alignClass = computed(() => {
    if (s.value.align === 'left') return 'align-left'
    if (s.value.align === 'right') return 'align-right'
    return 'align-center'
})
</script>

<style scoped lang="scss">
.figure {
    margin: 0;
    display: flex;
    flex-direction: column;
}

.figure.align-left {
    align-items: flex-start;
}

.figure.align-center {
    align-items: center;
}

.figure.align-right {
    align-items: flex-end;
}

.img {
    height: auto;
    border-radius: var(--border-radius-secondary);
}

.img.placeholder {
    aspect-ratio: 16 / 10;
    background: var(--color-background-primary);
    filter: brightness(var(--hover-brightness));
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    display: grid;
    place-items: center;
}

.placeholder-text {
    font-weight: 700;
    opacity: 0.7;
}

.caption {
    margin-top: 0.5em;
    opacity: 0.75;
}
</style>
