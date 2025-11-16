<template>
  <section class="showcase" :style="vars">
    <slot>
      <h1>Nadpis</h1>
      <p>Toto je text</p>
    </slot>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
