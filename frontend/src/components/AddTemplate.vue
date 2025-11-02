<template>
  <aside>
    <h1 class="title">Add template</h1>
    <ul>
      <li v-for="item in items" :key="item.name">
        <button class="item">
          <i class="icon">
            <component :is="item.icon" />
          </i>
          <span>{{ item.name }}</span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { Type, Image, LayoutGrid, Grid2X2, Mail } from 'lucide-vue-next'

const items = [
  { name: 'Text', icon: Type },
  { name: 'Image', icon: Image },
  { name: 'Projects', icon: LayoutGrid },
  { name: 'Gallery', icon: Grid2X2 },
  { name: 'Contact', icon: Mail },
]
</script>

<style scoped lang="scss">
aside {
  display: flex;
  flex-direction: column;
  width: 30%;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-secondary);
  padding: 1em;
  margin: var(--margin-primary);
  box-shadow: var(--box-shadow-primary);
  border: var(--border-primary);
}

.title {
  margin-bottom: 0.5em;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 3em;
  padding: 0 0.75em;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  transition:
    background 0.2s ease,
    filter 0.2s ease;
}

.item:hover {
  background: #f7f8fb;
  filter: brightness(var(--hover-brightness));
}

.icon {
  display: grid;
  place-items: center;
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.6em;
  color: var(--color-text-primary);
}
</style>
