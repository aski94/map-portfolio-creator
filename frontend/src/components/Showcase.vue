<template>
  <section class="showcase" :style="vars">
    <template v-if="templates?.length">
      <section v-for="t in templates" :key="t.id" class="template" :class="{
        selected: styleEnabled && t.id === selectedId,
        'align-right': getAlign(t) === 'right',
        'align-justify': getAlign(t) === 'justify',
        'align-left': getAlign(t) === 'left',
        'align-center': getAlign(t) === 'center',
      }" :style="{ marginBottom: `${general.gap}px` }">
        <button v-if="styleEnabled" class="edit" type="button" @click.stop="emit('edit', t.id)"
          aria-label="Edit template">
          <Pencil />
        </button>

        <component :is="resolveVariant(t.variant)" v-bind="t.props" />
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textComponents } from '@/components/templates/text'
import { Pencil } from 'lucide-vue-next'

const props = defineProps<{
  general: {
    pad: number
    gap: number
    font: string
    hSize: number
    tSize: number
    text: string
    heading: string
    accent: string
    bg: string
  }
  templates?: Array<{ id: string; variant: string; props: Record<string, any> }>
  styleEnabled?: boolean
  selectedId?: string
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
}>()

const vars = computed(() => ({
  padding: `${props.general.pad}px`,
  background: props.general.bg,
  color: props.general.text,
  fontFamily: props.general.font,
  '--text-size': `${props.general.tSize}px`,
  '--heading-size': `${props.general.hSize}px`,
  '--heading-color': props.general.heading,
  '--font-family-showcase': props.general.font,
}))

const variantMap: Record<string, any> = Object.fromEntries(textComponents.map(t => [t.variant, t.component]))

function resolveVariant(variant: string): any {
  return variantMap[variant]
}

function getAlign(t: { props: Record<string, any> }): 'left' | 'center' | 'right' | 'justify' {
  return (t.props?.style?.align ?? 'left') as any
}
</script>

<style scoped lang="scss">
.showcase {
  flex: 1;
  margin-bottom: var(--margin-primary);
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-secondary);
  box-shadow: var(--box-shadow-primary);
  border: var(--border-primary);
  margin-top: var(--margin-primary);
  padding: 5px;
  overflow-y: auto;
}

.showcase :where(p, li, span):not(.heading) {
  font-size: var(--text-size);
  font-family: var(--font-family-showcase);
}

.showcase :where(h1, h2, h3) {
  font-size: var(--heading-size);
  color: var(--heading-color);
  font-family: var(--font-family-showcase);
}

.template {
  position: relative;
  border-radius: var(--border-radius-secondary);
}

.template.selected {
  outline: 2px solid var(--color-primary);
  outline-offset: 15px;
}

.edit {
  position: absolute;
  top: 0.5em;
  width: 1.75em;
  height: 1.75em;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  z-index: 10;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.template:not(.align-right) .edit {
  right: 0.5em;
  left: auto;
}

.template.align-right .edit {
  left: 0.5em;
  right: auto;
}

.edit:hover {
  opacity: 1;
}
</style>
