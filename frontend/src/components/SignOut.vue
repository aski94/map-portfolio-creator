<template>
  <div class="overlay" @click.self="close">
    <section class="modal">
      <p class="title">Sign out</p>

      <p class="text">
        You’re currently signed in. Click the button below to sign out of your account.</p>

      <button class="submit" @click="signOut">
        Sign out
      </button>

      <button class="close" @click="close">×</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/auth/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])
const { logout } = useAuth()
const router = useRouter()

function close() {
  emit('close')
}

function signOut() {
  logout()
  emit('close')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
}

.modal {
  width: 22rem;
  background: var(--color-background-primary);
  padding: 2em;
  border-radius: var(--border-radius-secondary);
  box-shadow: var(--box-shadow-primary);
  position: relative;
  animation: fadeIn 0.2s ease-out;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.title {
  text-align: center;
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 0.75em;
  color: var(--color-text-primary);
}

.text {
  margin: 0 0 1.25em 0;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  line-height: 1.4;
}

.submit {
  width: 100%;
  height: 2.5em;
  margin-top: 0.25em;
  background: var(--color-primary);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-primary);
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.submit:hover {
  filter: brightness(var(--hover-brightness));
}

.close {
  position: absolute;
  top: 0.4em;
  right: 0.6em;
  font-size: 1.7rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
}
</style>
