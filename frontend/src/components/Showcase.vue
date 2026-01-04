<template>
  <section class="showcase" :style="vars">
    <template v-if="templates?.length">
      <component v-for="t in templates" :key="t.id" :is="resolveVariant(t.variant)" v-bind="t.props" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textComponents } from '@/components/templates/text'

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
  textComponents.map(t => [t.variant, t.component]),
)

function resolveVariant(variant: string): any {
  return variantMap[variant]
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

.showcase :where(p, li, span) {
  font-size: var(--text-size);
  font-family: var(--font-family-showcase);
}

.showcase :where(h1, h2, h3) {
  font-size: var(--heading-size);
  color: var(--heading-color);
  font-family: var(--font-family-showcase);
}
</style>
