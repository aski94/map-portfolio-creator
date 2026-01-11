<template>
    <aside>
        <h1 class="title">Image styling</h1>

        <form class="form" @submit.prevent @input="onChange">
            <section class="field">
                <label>Image</label>

                <input ref="fileEl" class="file" type="file" accept="image/*" @change="onFile" />

                <button type="button" class="file-btn" @click="pickFile">
                    Select image
                </button>

                <p class="hint" v-if="local.hasImage">Image selected</p>
                <p class="hint" v-else>No image selected</p>
            </section>

            <section class="field">
                <label for="caption">Caption</label>
                <input id="caption" type="text" v-model="local.caption" />
            </section>

            <section class="field">
                <label>Image alignment</label>

                <section class="segmented" role="group" aria-label="Image alignment">
                    <button type="button" :class="{ active: local.align === 'left' }" @click="setAlign('left')">
                        <AlignLeft />
                    </button>

                    <button type="button" :class="{ active: local.align === 'center' }" @click="setAlign('center')">
                        <AlignCenter />
                    </button>

                    <button type="button" :class="{ active: local.align === 'right' }" @click="setAlign('right')">
                        <AlignRight />
                    </button>
                </section>
            </section>

            <section class="field">
                <label for="size">Image size</label>
                <input id="size" type="range" min="5" max="100" v-model.number="local.widthPct" />
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
        </form>
    </aside>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-vue-next'

export type ImageTemplateStyle = {
    src: string
    caption: string
    align: 'left' | 'center' | 'right'
    widthPct: number
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    hasImage: boolean
}

const props = defineProps<{
    modelValue: ImageTemplateStyle
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: ImageTemplateStyle): void
}>()

const local = reactive<ImageTemplateStyle>({ ...props.modelValue })

watch(
    () => props.modelValue,
    (v) => Object.assign(local, v),
    { deep: true, immediate: true },
)

const fileEl = ref<HTMLInputElement | null>(null)

function pickFile() {
    fileEl.value?.click()
}

function onChange() {
    emit('update:modelValue', { ...local })
}

function setAlign(v: ImageTemplateStyle['align']) {
    local.align = v
    onChange()
}

async function onFile(e: Event) {
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

    local.src = out
    local.hasImage = true
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
    transition:
        background 0.2s ease,
        filter 0.2s ease;
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
    grid-template-columns: repeat(3, 1fr);
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
</style>
