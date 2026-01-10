<template>
    <aside>
        <h1 class="title">Template styling</h1>

        <form class="form" @submit.prevent @input="onChange">
            <section class="field">
                <label for="title">Heading</label>
                <input id="title" type="text" v-model="local.title" />
            </section>

            <section class="field">
                <label for="text">Text</label>
                <textarea id="text" v-model="local.text"></textarea>
            </section>

            <section class="field">
                <label for="gapHeadingText">Margin between heading and text</label>
                <input id="gapHeadingText" type="range" min="0" max="48" v-model.number="local.gapHeadingText" />
            </section>

            <section class="field">
                <label>Text alignment</label>

                <section class="segmented" role="group" aria-label="Text alignment">
                    <button type="button" :class="{ active: local.align === 'left' }" @click="setAlign('left')"
                        aria-label="Align left">
                        <AlignLeft />
                    </button>

                    <button type="button" :class="{ active: local.align === 'center' }" @click="setAlign('center')"
                        aria-label="Align center">
                        <AlignCenter />
                    </button>

                    <button type="button" :class="{ active: local.align === 'right' }" @click="setAlign('right')"
                        aria-label="Align right">
                        <AlignRight />
                    </button>

                    <button type="button" :class="{ active: local.align === 'justify' }" @click="setAlign('justify')"
                        aria-label="Justify text">
                        <AlignJustify />
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
                <label for="textColor">Text color</label>
                <input id="textColor" type="color" class="color" v-model="local.textColor" />
            </section>

            <section class="field">
                <label for="headingColor">Heading color</label>
                <input id="headingColor" type="color" class="color" v-model="local.headingColor" />
            </section>
        </form>
    </aside>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-vue-next'

type TemplateStyle = {
    title: string
    text: string
    gapHeadingText: number
    align: 'left' | 'center' | 'right' | 'justify'
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    textColor: string
    headingColor: string
}

const props = defineProps<{
    modelValue: TemplateStyle
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: TemplateStyle): void
}>()

const local = reactive<TemplateStyle>({ ...props.modelValue })

watch(
    () => props.modelValue,
    (v) => Object.assign(local, v),
    { deep: true, immediate: true },
)

function onChange() {
    emit('update:modelValue', { ...local })
}

function setAlign(v: TemplateStyle['align']) {
    local.align = v
    onChange()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/Panel.scss';

textarea {
    height: 7rem;
    resize: none;
    overflow-y: auto;
}

.segmented {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
