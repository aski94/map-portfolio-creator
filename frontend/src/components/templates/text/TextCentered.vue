<template>
    <section class="text">
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
.text {
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
}
</style>
