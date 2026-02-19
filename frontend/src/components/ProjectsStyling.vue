<template>
    <aside>
        <h1 class="title">Projects styling</h1>

        <form class="form" @submit.prevent @input="onChange">
            <section class="field">
                <label for="heading">Heading</label>
                <input id="heading" type="text" v-model="local.heading" />
            </section>

            <section class="field">
                <label>Layout</label>

                <section class="segmented" role="group" aria-label="Projects layout">
                    <button type="button" :class="{ active: local.layout === 'grid' }" @click="setLayout('grid')">
                        Grid
                    </button>
                    <button type="button" :class="{ active: local.layout === 'list' }" @click="setLayout('list')">
                        List
                    </button>
                </section>
            </section>

            <section class="field">
                <label>Padding</label>

                <section class="quad">
                    <section class="quad-field">
                        <label for="padTop">Top</label>
                        <input id="padTop" type="range" min="0" max="96" v-model.number="local.padTop" />
                    </section>

                    <section class="quad-field">
                        <label for="padBottom">Bottom</label>
                        <input id="padBottom" type="range" min="0" max="96" v-model.number="local.padBottom" />
                    </section>

                    <section class="quad-field">
                        <label for="padLeft">Left</label>
                        <input id="padLeft" type="range" min="0" max="96" v-model.number="local.padLeft" />
                    </section>

                    <section class="quad-field">
                        <label for="padRight">Right</label>
                        <input id="padRight" type="range" min="0" max="96" v-model.number="local.padRight" />
                    </section>
                </section>
            </section>

            <section class="field">
                <label>Projects</label>

                <section class="projects">
                    <section v-for="p in local.projects" :key="p.id" class="project">
                        <div class="row">
                            <label>Title</label>
                            <input type="text" v-model="p.title" />
                        </div>

                        <div class="row">
                            <label>Description</label>
                            <textarea v-model="p.description"></textarea>
                        </div>

                        <div class="row">
                            <label>Tags (comma separated)</label>
                            <input type="text" :defaultValue="(p.tags ?? []).join(', ')"
                                @change="setTags(p.id, $event)" />
                        </div>

                        <div class="row">
                            <label>GitHub URL</label>
                            <input type="url" v-model="p.github" placeholder="https://github.com/..." />
                        </div>

                        <div class="row">
                            <label>Other URL</label>
                            <input type="url" v-model="p.other" placeholder="https://..." />
                        </div>

                        <div class="row">
                            <label>Image</label>

                            <input :ref="(el) => setFileRef(p.id, el)" class="file" type="file" accept="image/*"
                                @change="onFile(p.id, $event)" />

                            <button type="button" class="file-btn" @click="pickFile(p.id)">Select image</button>

                            <p class="hint" v-if="p.imageSrc">Image selected</p>
                            <p class="hint" v-else>No image selected</p>
                        </div>

                        <div class="row">
                            <label>Image fit</label>

                            <section class="segmented" role="group" :aria-label="`Image fit for ${p.title}`">
                                <button type="button" :class="{ active: (p.imageFit ?? 'cover') === 'cover' }"
                                    @click="setProjectImageFit(p.id, 'cover')">
                                    Cover
                                </button>
                                <button type="button" :class="{ active: (p.imageFit ?? 'cover') === 'contain' }"
                                    @click="setProjectImageFit(p.id, 'contain')">
                                    Contain
                                </button>
                            </section>
                        </div>

                        <div class="row">
                            <label :for="`imageHeight-${p.id}`">Image height  — {{ p.imageHeight ?? 200 }}</label>
                            <input :id="`imageHeight-${p.id}`" type="range" min="80" max="400" step="5"
                                :value="p.imageHeight ?? 200" @input="setProjectNumber(p.id, 'imageHeight', $event)" />
                        </div>

                        <div class="row">
                            <section class="quad">
                                <section class="quad-field">
                                    <label :for="`imagePosX-${p.id}`">Image horizontal</label>
                                    <input :id="`imagePosX-${p.id}`" type="range" min="0" max="100"
                                        :value="p.imagePosX ?? 50"
                                        @input="setProjectNumber(p.id, 'imagePosX', $event)" />
                                </section>

                                <section class="quad-field">
                                    <label :for="`imagePosY-${p.id}`">Image vertical</label>
                                    <input :id="`imagePosY-${p.id}`" type="range" min="0" max="100"
                                        :value="p.imagePosY ?? 50"
                                        @input="setProjectNumber(p.id, 'imagePosY', $event)" />
                                </section>
                            </section>
                        </div>

                        <button type="button" class="danger" @click="removeProject(p.id)">Remove project</button>
                    </section>

                    <button type="button" class="add" @click="addProject">Add project</button>
                </section>
            </section>
        </form>
    </aside>
</template>

<script setup lang="ts">
import { reactive, watch, type ComponentPublicInstance } from 'vue'

export type ProjectsTemplateProject = {
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

export type ProjectsTemplateStyle = {
    heading: string
    layout: 'grid' | 'list'
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    projects: ProjectsTemplateProject[]
}

const props = defineProps<{
    modelValue: ProjectsTemplateStyle
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: ProjectsTemplateStyle): void
}>()

const local = reactive<ProjectsTemplateStyle>({ ...props.modelValue })

watch(
    () => props.modelValue,
    (v) => Object.assign(local, v),
    { deep: true, immediate: true },
)

const fileRefs = new Map<string, HTMLInputElement>()

function setFileRef(id: string, el: Element | ComponentPublicInstance | null) {
    const input = (el as unknown) as HTMLInputElement | null
    if (!input || !(input instanceof HTMLInputElement)) {
        fileRefs.delete(id)
        return
    }
    fileRefs.set(id, input)
}

function pickFile(id: string) {
    fileRefs.get(id)?.click()
}

function onChange() {
    emit('update:modelValue', { ...local, projects: local.projects.map((p) => ({ ...p })) })
}

function setLayout(v: ProjectsTemplateStyle['layout']) {
    local.layout = v
    onChange()
}

function setProjectImageFit(id: string, v: 'cover' | 'contain') {
    const p = local.projects.find((x) => x.id === id)
    if (!p) return
    p.imageFit = v
    onChange()
}

function setProjectNumber(id: string, key: 'imageHeight' | 'imagePosX' | 'imagePosY', e: Event) {
    const p = local.projects.find((x) => x.id === id)
    if (!p) return
    p[key] = Number((e.target as HTMLInputElement).value)
    onChange()
}

function setTags(id: string, e: Event) {
    const value = (e.target as HTMLInputElement).value
    const tags = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

    const p = local.projects.find((x) => x.id === id)
    if (!p) return

    p.tags = tags
    onChange()
}

function addProject() {
    local.projects.push({
        id: crypto.randomUUID(),
        title: 'Project name',
        description: 'Short description of what you built.',
        tags: ['Design', 'Development'],
        imageSrc: '',
        imageFit: 'cover',
        imageHeight: 200,
        imagePosX: 50,
        imagePosY: 50,
        github: '',
        other: '',
    })
    onChange()
}

function removeProject(id: string) {
    const idx = local.projects.findIndex((p) => p.id === id)
    if (idx < 0) return
    local.projects.splice(idx, 1)
    onChange()
}

async function onFile(id: string, e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result ?? ''))
        r.onerror = () => reject(new Error('read error'))
        r.readAsDataURL(file)
    }).catch(() => '')

    if (!dataUrl) return

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error('img error'))
        el.src = dataUrl
    }).catch(() => null)

    if (!img) return

    const maxSide = 1600
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0, w, h)
    const out = canvas.toDataURL('image/jpeg', 0.82)

    const p = local.projects.find((x) => x.id === id)
    if (!p) return

    p.imageSrc = out
    onChange()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/Panel.scss';

textarea {
    height: 6.5rem;
    resize: none;
    overflow-y: auto;
}

.file {
    display: none;
}

.file-btn {
    height: 2.5em;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    cursor: pointer;
    transition: background 0.2s ease, filter 0.2s ease;
}

.file-btn:hover {
    background: #f7f8fb;
    filter: brightness(var(--hover-brightness));
}

.hint {
    margin: 0.5em 0 0 0;
    opacity: 0.75;
    font-size: 0.9em;
}

.segmented {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    overflow: hidden;
}

.segmented button {
    height: 2.5em;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-primary);
    transition: background 0.15s ease;
}

.segmented button+button {
    border-left: var(--border-primary);
}

.segmented button:hover {
    background: #f7f8fb;
}

.segmented button.active {
    background: #f7f8fb;
}

.quad {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75em;
}

.quad-field {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}

.projects {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
}

.project {
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    padding: 0.9em;
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    background: var(--color-background-primary);
}

.row {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
}

.add,
.danger {
    height: 2.5em;
    width: 100%;
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    background: var(--color-background-primary);
    cursor: pointer;
    transition: background 0.2s ease, filter 0.2s ease;
}

.add:hover,
.danger:hover {
    background: #f7f8fb;
    filter: brightness(var(--hover-brightness));
}
</style>