<template>
    <section class="wrap" :style="rootStyle">
        <section class="top" v-if="heading">
            <p class="heading">{{ heading }}</p>
        </section>

        <section class="items" :class="{
            grid: layout === 'grid',
            list: layout === 'list',
            single: layout === 'grid' && projects.length === 1,
        }">
            <article v-for="p in projects" :key="p.id" class="card">
                <div class="thumb-wrap" :style="{ '--image-height': `${p.imageHeight ?? 200}px` }">
                    <img v-if="p.imageSrc" class="thumb" :src="p.imageSrc" :alt="p.title"
                        :style="{ objectFit: p.imageFit ?? 'cover', objectPosition: `${p.imagePosX ?? 50}% ${p.imagePosY ?? 50}%` }" />
                    <div v-else class="thumb placeholder">
                        <span>Select an image in the styling section</span>
                    </div>
                </div>

                <div class="content">
                    <div class="head">
                        <p class="title">{{ p.title }}</p>

                        <div class="links" v-if="p.github || p.other">
                            <a v-if="p.github" class="link" :href="p.github" target="_blank" rel="noreferrer"
                                aria-label="GitHub">
                                <Github />
                            </a>

                            <a v-if="p.other" class="link" :href="p.other" target="_blank" rel="noreferrer"
                                aria-label="Link">
                                <LinkIcon />
                            </a>
                        </div>
                    </div>

                    <p v-if="p.description" class="desc">{{ p.description }}</p>

                    <ul v-if="p.tags?.length" class="tags">
                        <li v-for="t in p.tags" :key="t" class="tag">{{ t }}</li>
                    </ul>
                </div>
            </article>
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Github, Link as LinkIcon } from 'lucide-vue-next'

export type ProjectItem = {
    id: string
    title: string
    description?: string
    tags?: string[]
    imageSrc?: string
    imageFit?: 'cover' | 'contain'
    imageHeight?: number
    imagePosX?: number
    imagePosY?: number
    github?: string
    other?: string
}

export type ProjectsStyle = {
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
}

const props = defineProps<{
    heading?: string
    layout: 'grid' | 'list'
    projects: ProjectItem[]
    style?: Partial<ProjectsStyle>
}>()

const s = computed<ProjectsStyle>(() => ({
    padTop: props.style?.padTop ?? 0,
    padRight: props.style?.padRight ?? 0,
    padBottom: props.style?.padBottom ?? 0,
    padLeft: props.style?.padLeft ?? 0,
}))

const rootStyle = computed(() => ({
    padding: `${s.value.padTop}px ${s.value.padRight}px ${s.value.padBottom}px ${s.value.padLeft}px`,
    borderRadius: 'var(--border-radius-secondary)',
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.items.grid.single {
    grid-template-columns: 1fr;
}

.items.list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.items.grid .card {
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    background: var(--color-background-primary);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.items.list .card {
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    background: var(--color-background-primary);
    overflow: hidden;
    display: grid;
    grid-template-columns: 10rem 1fr;
    align-items: stretch;
    min-height: 7.5rem;
}

.items.grid .thumb-wrap {
    width: 100%;
    height: var(--image-height);
    flex-shrink: 0;
    overflow: hidden;
    background: var(--color-background-primary);
    filter: brightness(var(--hover-brightness));
    display: flex;
    align-items: center;
    justify-content: center;
}

.items.list .thumb-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--color-background-primary);
    filter: brightness(var(--hover-brightness));
    border-right: var(--border-primary);
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
    display: grid;
    place-items: center;
    text-align: center;
    padding: 0.75rem;
    opacity: 0.8;
    font-size: 0.85em;
    color: var(--color-text-primary);
}

.items.list .thumb.placeholder {
    min-height: 7.5rem;
}

.items.grid .thumb.placeholder {
    border-bottom: var(--border-primary);
}

.content {
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
}

.title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
}

.links {
    display: flex;
    gap: 0.5rem;
}

.link {
    width: 2.1rem;
    height: 2.1rem;
    display: grid;
    place-items: center;
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    color: var(--color-text-primary);
    background: var(--color-background-primary);
    transition: filter 0.12s ease, background 0.2s ease;
}

.link:hover {
    filter: brightness(var(--hover-brightness));
    background: #f7f8fb;
}

.desc {
    margin: 0;
    opacity: 0.85;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0.25rem 0 0 0;
}

.tag {
    padding: 0.25rem 0.55rem;
    border: var(--border-primary);
    border-radius: 999px;
    opacity: 0.8;
    font-size: 0.9em;
}
</style>