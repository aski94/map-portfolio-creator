<template>
  <Header></Header>
  <section class="layout">
    <AddTemplate></AddTemplate>
    <main>
      <Toolbar></Toolbar>
      <Showcase :general="general"></Showcase>
    </main>
    <Styling @update:general="updateGeneral"></Styling>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Header from '@/components/Header.vue'
import AddTemplate from '@/components/AddTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import Showcase from '@/components/Showcase.vue'
import Styling from '@/components/Styling.vue'

const general = reactive({
  pad: 32,
  gap: 20,
  font: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  hSize: 28,
  tSize: 16,
  text: '#111111',
  heading: '#000000',
  accent: '#4f46e5',
  bg: '#ffffff',
})

function updateGeneral(v: typeof general) {
  Object.assign(general, v)
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 58px);
}

main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
}
</style>
