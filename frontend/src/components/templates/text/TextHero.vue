<template>
    <section class="hero">
        <h1>{{ title }}</h1>
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
.hero {
    padding: 4rem 2rem;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    font-weight: 800;
}

.hero p {
    max-width: 640px;
    margin: 1rem auto 0;
}
</style>
