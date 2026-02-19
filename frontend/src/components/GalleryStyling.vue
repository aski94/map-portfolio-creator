<template>
    <aside>
        <h1 class="title">Gallery styling</h1>

        <form class="form" @submit.prevent @input="onChange">
            <section class="field">
                <label for="heading">Heading</label>
                <input id="heading" type="text" v-model="local.heading" />
            </section>

            <section class="field">
                <label>Layout</label>

                <section class="segmented" role="group" aria-label="Gallery layout">
                    <button type="button" :class="{ active: local.layout === 'grid' }" @click="setLayout('grid')">
                        Grid
                    </button>
                    <button type="button" :class="{ active: local.layout === 'slider' }" @click="setLayout('slider')">
                        Slider
                    </button>
                </section>
            </section>

            <section class="field">
                <label>Columns & gap</label>

                <section class="quad">
                    <section class="quad-field">
                        <label for="columns">Columns — {{ local.columns }}</label>
                        <input id="columns" type="range" min="1" max="6" step="1" v-model.number="local.columns" />
                    </section>

                    <section class="quad-field">
                        <label for="gap">Gap — {{ local.gap }}px</label>
                        <input id="gap" type="range" min="0" max="48" step="2" v-model.number="local.gap" />
                    </section>
                </section>
            </section>

            <section class="field">
                <label for="galleryImageHeight">Image height — {{ local.imageHeight }}</label>
                <input id="galleryImageHeight" type="range" min="80" max="600" step="5"
                    v-model.number="local.imageHeight" />
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
                <label>Images</label>

                <section class="items">
                    <section v-for="item in local.items" :key="item.id" class="item">
                        <div class="row">
                            <label>Image</label>

                            <input :ref="(el) => setFileRef(item.id, el)" class="file" type="file" accept="image/*"
                                @change="onFile(item.id, $event)" />

                            <button type="button" class="file-btn" @click="pickFile(item.id)">Select image</button>

                            <p class="hint" v-if="item.imageSrc">Image selected</p>
                            <p class="hint" v-else>No image selected</p>
                        </div>

                        <div class="row">
                            <label>Image fit</label>

                            <section class="segmented" role="group" :aria-label="`Image fit for item ${item.id}`">
                                <button type="button" :class="{ active: (item.imageFit ?? 'cover') === 'cover' }"
                                    @click="setItemImageFit(item.id, 'cover')">
                                    Cover
                                </button>
                                <button type="button" :class="{ active: (item.imageFit ?? 'cover') === 'contain' }"
                                    @click="setItemImageFit(item.id, 'contain')">
                                    Contain
                                </button>
                            </section>
                        </div>

                        <div class="row">
                            <section class="quad">
                                <section class="quad-field">
                                    <label :for="`imagePosX-${item.id}`">Image horizontal</label>
                                    <input :id="`imagePosX-${item.id}`" type="range" min="0" max="100"
                                        :value="item.imagePosX ?? 50"
                                        @input="setItemNumber(item.id, 'imagePosX', $event)" />
                                </section>

                                <section class="quad-field">
                                    <label :for="`imagePosY-${item.id}`">Image vertical</label>
                                    <input :id="`imagePosY-${item.id}`" type="range" min="0" max="100"
                                        :value="item.imagePosY ?? 50"
                                        @input="setItemNumber(item.id, 'imagePosY', $event)" />
                                </section>
                            </section>
                        </div>

                        <button type="button" class="danger" @click="removeItem(item.id)">Remove image</button>
                    </section>

                    <button type="button" class="add" @click="addItem">Add image</button>
                </section>
            </section>
        </form>
    </aside>
</template>

<script setup lang="ts">
import { reactive, watch, type ComponentPublicInstance } from 'vue'

export type GalleryTemplateItem = {
    id: string
    imageSrc?: string
    imageFit?: 'cover' | 'contain'
    imagePosX?: number
    imagePosY?: number
}

export type GalleryTemplateStyle = {
    heading: string
    layout: 'grid' | 'slider'
    columns: number
    gap: number
    imageHeight: number
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    items: GalleryTemplateItem[]
}

const props = defineProps<{
    modelValue: GalleryTemplateStyle
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: GalleryTemplateStyle): void
}>()

const local = reactive<GalleryTemplateStyle>({ ...props.modelValue })

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
    emit('update:modelValue', { ...local, items: local.items.map((i) => ({ ...i })) })
}

function setLayout(v: GalleryTemplateStyle['layout']) {
    local.layout = v
    onChange()
}

function setItemImageFit(id: string, v: 'cover' | 'contain') {
    const item = local.items.find((x) => x.id === id)
    if (!item) return
    item.imageFit = v
    onChange()
}

function setItemNumber(id: string, key: 'imagePosX' | 'imagePosY', e: Event) {
    const item = local.items.find((x) => x.id === id)
    if (!item) return
    item[key] = Number((e.target as HTMLInputElement).value)
    onChange()
}

function addItem() {
    local.items.push({
        id: crypto.randomUUID(),
        imageSrc: '',
        imageFit: 'cover',
        imagePosX: 50,
        imagePosY: 50,
    })
    onChange()
}

function removeItem(id: string) {
    const idx = local.items.findIndex((i) => i.id === id)
    if (idx < 0) return
    local.items.splice(idx, 1)
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

    const item = local.items.find((x) => x.id === id)
    if (!item) return

    item.imageSrc = out
    onChange()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/Panel.scss';

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

.segmented.triple {
    grid-template-columns: repeat(3, 1fr);
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

.items {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
}

.item {
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
