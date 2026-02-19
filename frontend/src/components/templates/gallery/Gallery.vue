<template>
    <section class="wrap" :style="rootStyle">
        <header class="top" v-if="heading">
            <p class="heading">{{ heading }}</p>
        </header>

        <section class="items" :class="{
            grid: layout === 'grid',
            slider: layout === 'slider',
        }">
            <div v-for="item in items" :key="item.id" class="cell">
                <div class="thumb-wrap">
                    <img v-if="item.imageSrc" class="thumb" :src="item.imageSrc" alt="" :style="{
                        objectFit: item.imageFit ?? 'cover',
                        objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                    }" />
                    <div v-else class="thumb placeholder">
                        <span>Select an image in the styling section</span>
                    </div>
                </div>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type GalleryItem = {
    id: string
    imageSrc?: string
    imageFit?: 'cover' | 'contain'
    imagePosX?: number
    imagePosY?: number
}

export type GalleryStyle = {
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    columns: number
    gap: number
    imageHeight: number
}

const props = defineProps<{
    heading?: string
    layout: 'grid' | 'slider'
    items: GalleryItem[]
    style?: Partial<GalleryStyle>
}>()

const s = computed<GalleryStyle>(() => ({
    padTop: props.style?.padTop ?? 0,
    padRight: props.style?.padRight ?? 0,
    padBottom: props.style?.padBottom ?? 0,
    padLeft: props.style?.padLeft ?? 0,
    columns: props.style?.columns ?? 3,
    gap: props.style?.gap ?? 8,
    imageHeight: props.style?.imageHeight ?? 200,
}))

const rootStyle = computed(() => ({
    padding: `${s.value.padTop}px ${s.value.padRight}px ${s.value.padBottom}px ${s.value.padLeft}px`,
    borderRadius: 'var(--border-radius-secondary)',
    '--columns': s.value.columns,
    '--gap': `${s.value.gap}px`,
    '--image-height': `${s.value.imageHeight}px`,
}))
</script>

<style scoped lang="scss">
.wrap {
    width: 100%;
}

.top {
    margin-bottom: 1rem;
}

.heading {
    margin: 0;
    font-weight: 700;
    font-size: 1.25rem;
}

.items.grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    gap: var(--gap);
}

.items.slider {
    display: flex;
    gap: var(--gap);
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.25rem;
}

.items.slider .cell {
    flex: 0 0 calc((100% - (var(--columns) - 1) * var(--gap)) / var(--columns));
    scroll-snap-align: start;
}

.cell {
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    background: var(--color-background-primary);
    overflow: hidden;
}

.thumb-wrap {
    width: 100%;
    height: var(--image-height, 200px);
    overflow: hidden;
    background: var(--color-background-primary);
    filter: brightness(var(--hover-brightness));
    display: flex;
    align-items: center;
    justify-content: center;
}

.thumb {
    width: 100%;
    height: 100%;
    display: block;
}

.thumb.placeholder {
    width: 100%;
    height: 100%;
    min-height: 8rem;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 0.75rem;
    opacity: 0.8;
    font-size: 0.85em;
    color: var(--color-text-primary);
}
</style>
