<template>
    <div class="overlay" @click.self="close">
        <section class="modal">
            <div class="top">
                <p class="title">Choose a template</p>
                <button class="close" @click="close">×</button>
            </div>

            <section class="grid">
                <button v-for="item in items" :key="item.variant" class="card" @click="select(item.variant)">
                    <div class="preview"></div>

                    <div class="bottom">
                        <p class="name">{{ item.name }}</p>

                        <i class="icon">
                            <component :is="item.icon" />
                        </i>
                    </div>
                </button>
            </section>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Type, Image, LayoutGrid, Grid2X2, Mail } from 'lucide-vue-next'

const props = defineProps<{
    templateType: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'select', variant: string): void
}>()

const variants: Record<string, Array<{ variant: string; name: string; icon: any }>> = {
    text: [
        { variant: 'text.basic', name: 'Basic text', icon: Type },
        { variant: 'text.centered', name: 'Centered text', icon: Type },
        { variant: 'text.split', name: 'Split text', icon: Type },
        { variant: 'text.hero', name: 'Hero text', icon: Type },
    ],
    image: [
        { variant: 'image.basic', name: 'Basic image', icon: Image },
        { variant: 'image.full', name: 'Full width image', icon: Image },
        { variant: 'image.with-text', name: 'Image with text', icon: Image },
        { variant: 'image.gallery', name: 'Image gallery', icon: Image },
    ],
    projects: [
        { variant: 'projects.grid', name: 'Projects grid', icon: LayoutGrid },
        { variant: 'projects.cards', name: 'Project cards', icon: LayoutGrid },
        { variant: 'projects.list', name: 'Project list', icon: LayoutGrid },
        { variant: 'projects.featured', name: 'Featured project', icon: LayoutGrid },
    ],
    gallery: [
        { variant: 'gallery.grid', name: 'Grid gallery', icon: Grid2X2 },
        { variant: 'gallery.masonry', name: 'Masonry gallery', icon: Grid2X2 },
        { variant: 'gallery.carousel', name: 'Carousel gallery', icon: Grid2X2 },
        { variant: 'gallery.fullscreen', name: 'Fullscreen gallery', icon: Grid2X2 },
    ],
    contact: [
        { variant: 'contact.basic', name: 'Basic contact', icon: Mail },
        { variant: 'contact.split', name: 'Split layout', icon: Mail },
        { variant: 'contact.centered', name: 'Centered contact', icon: Mail },
        { variant: 'contact.map', name: 'Contact with map', icon: Mail },
    ],
}

const items = computed(() => variants[props.templateType] ?? [])

function close() {
    emit('close')
}

function select(variant: string) {
    emit('select', variant)
    emit('close')
}
</script>

<style scoped lang="scss">
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
}

.modal {
    width: 44rem;
    height: 32rem;
    overflow: hidden;
    background: var(--color-background-primary);
    padding: 1.5em;
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    box-shadow: var(--box-shadow-primary);
    position: relative;
}

.top {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 1.25em;
}

.title {
    text-align: center;
    font-weight: 800;
    font-size: 1.75rem;
    color: var(--color-text-primary);
}

.close {
    position: absolute;
    right: 0;
    top: -0.5em;
    font-size: 1.7rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-primary);
}

.grid {
    height: calc(100% - 3.25rem);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 1fr;
    gap: 1em;
}

.card {
    width: 100%;
    height: 100%;
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    background: var(--color-background-primary);
    cursor: pointer;
    transition: filter 0.12s ease, background 0.2s ease;
}

.card:hover {
    filter: brightness(var(--hover-brightness));
    background: #f7f8fb;
}

.preview {
    width: 100%;
    height: calc(100% - 3.25rem);
    background: #ffffff;
    border-bottom: var(--border-primary);
}

.bottom {
    height: 3.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.9em 1em;
    gap: 0.75em;
}

.name {
    font-weight: 800;
    color: var(--color-text-primary);
}

.icon {
    display: grid;
    place-items: center;
    width: 1.5em;
    height: 1.5em;
    color: var(--color-text-primary);
}
</style>
