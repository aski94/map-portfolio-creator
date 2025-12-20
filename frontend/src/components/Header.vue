<template>
  <header>
    <section>
      <p class="logo">Portfolio</p>
    </section>
    <nav>
      <button class="button-secondary">Settings</button>
      <button>Export</button>
      <i class="user" @click="onUserClick">
        <User />
      </i>
    </nav>
  </header>

  <Login v-if="showLogin" @close="showLogin = false" @logged-in="onLoggedIn" />
  <SignOut v-if="showSignOut" @close="showSignOut = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User } from 'lucide-vue-next'
import Login from '@/components/Login.vue'
import SignOut from '@/components/SignOut.vue'
import { useAuth } from '@/auth/auth'

const { isLoggedIn } = useAuth()

const showLogin = ref(false)
const showSignOut = ref(false)

function onUserClick() {
  if (isLoggedIn()) {
    showSignOut.value = true
    showLogin.value = false
    return
  }

  showLogin.value = true
  showSignOut.value = false
}

function onLoggedIn() {
  showLogin.value = false
  showSignOut.value = false
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  padding: 0.5em;
}

.logo {
  font-weight: 800;
  font-size: 1.75rem;
  color: var(--color-text-secondary);
}

.user {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  background: var(--color-text-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.user:hover {
  transform: scale(1.05);
}

button {
  height: 2.5em;
  background: var(--color-text-secondary);
  color: var(--color-text-primary);
  border: none;
  padding: 0rem 1rem;
  border-radius: var(--border-radius-primary);
  backdrop-filter: blur(6px);
  transition:
    background 0.2s ease,
    filter 0.2s ease;
}

button:hover {
  background: #e6e6e6;
  filter: brightness(var(--hover-brightness));
}

.button-secondary {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-text-secondary);
}

.button-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  filter: brightness(1.05);
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}
</style>
