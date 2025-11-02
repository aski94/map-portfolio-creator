<template>
  <section class="toolbar">
    <button>
      <i class="icon">
        <Settings2 />
      </i>
      <span>General style</span>
    </button>
    <button>
      <i class="icon">
        <SlidersHorizontal />
      </i>
      <span>Style</span>
    </button>
    <button>
      <i class="icon">
        <Trash2 />
      </i>
      <span>Delete</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { Settings2, SlidersHorizontal, Trash2 } from 'lucide-vue-next'
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: var(--margin-primary);
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
  box-shadow: var(--box-shadow-primary);
  transition:
    background 0.2s ease,
    filter 0.2s ease;
}

button:hover {
  background: #f7f8fb;
  filter: brightness(var(--hover-brightness));
}

.icon {
  display: grid;
  place-items: center;
  width: 1.5em;
  height: 1.5em;
  color: inherit;
}
</style>
