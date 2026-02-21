<template>
    <section class="toolbar">
        <button :class="{ 'button-active': view === 'showcase' }" @click="
            emit('update:mode', 'general');
        emit('update:view', 'showcase');
        ">
            <i class="icon">
                <Monitor />
            </i>
            <span>Showcase</span>
        </button>

        <button :class="{ 'button-active': view === 'add' }" @click="
            emit('update:mode', 'general');
        emit('update:view', 'add');
        ">
            <i class="icon">
                <Plus />
            </i>
            <span>Add</span>
        </button>

        <div class="divider" />

        <button :class="{ 'button-active': view === 'style' && mode === 'general' }" @click="
            emit('update:mode', 'general');
        emit('update:view', 'style');
        ">
            <i class="icon">
                <Settings2 />
            </i>
            <span>General</span>
        </button>

        <button :class="{ 'button-active': mode === 'style' }" @click="
            emit('update:mode', 'style');
        emit('update:view', 'showcase');
        ">
            <i class="icon">
                <SlidersHorizontal />
            </i>
            <span>Style</span>
        </button>

        <button :class="{ 'button-active': view === 'showcase' && mode === 'reorder' }" @click="
            emit('update:mode', 'reorder');
        emit('update:view', 'showcase');
        ">
            <i class="icon">
                <SendToBack />
            </i>
            <span>Reorder</span>
        </button>

        <button :class="{ 'button-active': view === 'showcase' && mode === 'delete' }" @click="
            emit('update:mode', 'delete');
        emit('update:view', 'showcase');
        ">
            <i class="icon">
                <Trash2 />
            </i>
            <span>Delete</span>
        </button>
    </section>
</template>

<script setup lang="ts">
import { Monitor, Plus, Settings2, SlidersHorizontal, Trash2, SendToBack } from 'lucide-vue-next'

type Mode = 'general' | 'style' | 'reorder' | 'delete'
type View = 'showcase' | 'add' | 'style'

defineProps<{ mode: Mode; view: View }>()

const emit = defineEmits<{
    (e: 'update:mode', v: Mode): void
    (e: 'update:view', v: View): void
}>()
</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    align-items: center;
    gap: 0.4em;
    margin-top: var(--margin-primary);
    margin-bottom: var(--margin-primary);
    flex-wrap: wrap;
    padding: 0 var(--margin-primary);
}

.divider {
    width: 1px;
    height: 1.75em;
    background: #e6e8ee;
    flex-shrink: 0;
}

button {
    display: flex;
    align-items: center;
    gap: 0.4em;
    height: 2.5em;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    border: var(--border-primary);
    padding: 0 1em;
    border-radius: var(--border-radius-primary);
    transition: background 0.2s ease, filter 0.2s ease;
    white-space: nowrap;
}

button:hover {
    background: #f7f8fb;
    filter: brightness(var(--hover-brightness));
}

.button-active {
    background: #f7f8fb;
    border-color: var(--color-primary);
    font-weight: 600;
}

.icon {
    display: grid;
    place-items: center;
    width: 1.5em;
    height: 1.5em;
    color: inherit;
    flex-shrink: 0;
}

@media (max-width: 765px) {
    .toolbar {
        gap: 0.3em;
    }

    button span {
        display: none;
    }

    button {
        width: 2.4em;
        height: 2.4em;
        padding: 0;
        justify-content: center;
    }

    .divider {
        margin: 0 0.1em;
    }
}
</style>