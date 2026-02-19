<template>
  <section class="showcase" :style="vars">
    <template v-if="templates?.length">
      <section v-for="(t, i) in templates" :key="t.id" class="template" :class="{
        selected: styleEnabled && t.id === selectedId,
        'align-right': getAlign(t) === 'right',
        'align-justify': getAlign(t) === 'justify',
        'align-left': getAlign(t) === 'left',
        'align-center': getAlign(t) === 'center',
      }" :style="{ marginBottom: `${general.gap}px` }">
        <section v-if="reorderEnabled" class="reorder">
          <button class="action reorder up" type="button" aria-label="Move template up" :disabled="i === 0"
            @click.stop="emit('move', t.id, -1)">
            <ChevronUp />
          </button>

          <button class="action reorder down" type="button" aria-label="Move template down"
            :disabled="i === templates.length - 1" @click.stop="emit('move', t.id, +1)">
            <ChevronDown />
          </button>
        </section>

        <button v-if="styleEnabled" class="action edit" type="button" @click.stop="emit('edit', t.id)"
          aria-label="Edit template">
          <Pencil />
        </button>

        <button v-if="deleteEnabled" class="action delete" type="button" @click.stop="emit('delete', t.id)"
          aria-label="Delete template">
          <Trash2 />
        </button>

        <component :is="resolveVariant(t.variant)" v-bind="t.props" />
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textComponents } from '@/components/templates/text'
import { imageComponents } from '@/components/templates/image'
import { projectComponents } from '@/components/templates/projects'
import { galleryComponents } from '@/components/templates/gallery'
import { contactComponents } from '@/components/templates/contact'
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next'

type TemplateItem = { id: string; variant: string; props: Record<string, any> }

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
  templates?: TemplateItem[]
  styleEnabled?: boolean
  deleteEnabled?: boolean
  reorderEnabled?: boolean
  selectedId?: string
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'move', id: string, dir: -1 | 1): void
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

const variantMap: Record<string, any> = Object.fromEntries(
  [...textComponents, ...imageComponents, ...projectComponents, ...galleryComponents, ...contactComponents].map((t) => [
    t.variant,
    t.component,
  ]),
)

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

.showcase :where(p, li, span, a):not(.heading) {
  font-size: var(--text-size);
  font-family: var(--font-family-showcase);
}

.showcase :where(h1, h2, h3, .heading) {
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

.action {
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

.template:not(.align-right) .action {
  right: 0.5em;
  left: auto;
}

.template.align-right .action {
  left: 0.5em;
  right: auto;
}

.action:hover {
  opacity: 1;
}

.action:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.action.reorder {
  left: 0.5em;
  right: auto;
}

.action.reorder.down {
  top: calc(0.5em + 1.95em);
}
</style>
