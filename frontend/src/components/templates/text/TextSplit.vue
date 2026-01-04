<template>
  <section class="split">
    <h2>{{ title }}</h2>
    <p>{{ text }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
}>()
</script>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}
</style>
