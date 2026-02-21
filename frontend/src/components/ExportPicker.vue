<template>
    <div class="overlay" @click.self="close">
        <section class="modal">
            <div class="top">
                <p class="title">Export portfolio</p>
                <button class="close" @click="close">×</button>
            </div>

            <section class="grid">
                <section class="card" @click="select('html')">
                    <div class="preview">
                        <p class="big">HTML</p>
                        <p class="small">For sharing and hosting</p>
                    </div>

                    <div class="bottom">
                        <p class="name">Export as HTML</p>
                        <i class="icon">
                            <FileCode2 />
                        </i>
                    </div>
                </section>

                <section class="card" @click="select('pdf')">
                    <div class="preview">
                        <p class="big">PDF</p>
                        <p class="small">For resumes and email</p>
                    </div>

                    <div class="bottom">
                        <p class="name">Export as PDF</p>
                        <i class="icon">
                            <FileDown />
                        </i>
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script setup lang="ts">
import { FileCode2, FileDown } from 'lucide-vue-next'

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'select', format: 'html' | 'pdf'): void
}>()

function close() {
    emit('close')
}

function select(format: 'html' | 'pdf') {
    emit('select', format)
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
    height: 22rem;
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
    overflow: hidden;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35em;
}

.big {
    margin: 0;
    font-weight: 900;
    font-size: 2.4rem;
    color: #111111;
}

.small {
    margin: 0;
    font-weight: 600;
    opacity: 0.7;
    color: #111111;
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

@media (max-width: 765px) {
    .small {
        display: none;
    }

    p.name {
        font-size: 0.75em;
    }

    p.big {
        font-size: 2em;
    }

    .modal {
        margin: 1em;
        padding-left: 1em;
        padding-right: 1em;
    }
}
</style>
