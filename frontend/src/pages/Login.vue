<template>
    <LoginModal @logged-in="onLoggedIn" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import LoginModal from "@/components/Login.vue";

const router = useRouter();

function onLoggedIn() {
  router.push("/");
}
</script>

<style scoped lang="scss">
</style>
