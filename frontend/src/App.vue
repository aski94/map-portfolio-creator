<template>
  <Header></Header>
  <section class="layout">
    <AddTemplate></AddTemplate>
    <main>
      <Toolbar></Toolbar>
      <Showcase></Showcase>
    </main>
    <AddTemplate></AddTemplate>
  </section>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import AddTemplate from '@/components/AddTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import Showcase from '@/components/Showcase.vue'
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
