<template>
  <div class="overlay" @click.self="close">
    <section class="modal">
      <p class="title">
        {{ mode === 'login' ? 'Login' : 'Sign up' }}
      </p>

      <form class="form" @submit.prevent="submit">
        <label for="email">
          Email
          <input id="email" type="email" placeholder="Enter your email…" v-model="email" required />
        </label>

        <label for="password">
          Password
          <div class="password-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password…"
              v-model="password"
              required
            />
            <i class="eye" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" />
              <EyeOff v-else />
            </i>
          </div>
        </label>

        <label v-if="mode === 'signup'" for="confirm-password">
          Confirm password
          <div class="password-wrapper">
            <input
              id="confirm-password"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Confirm your password…"
              v-model="confirmPassword"
              required
            />
            <i class="eye" @click="showConfirm = !showConfirm">
              <Eye v-if="!showConfirm" />
              <EyeOff v-else />
            </i>
          </div>
        </label>

        <button class="submit">
          {{ mode === 'login' ? 'Log in' : 'Create account' }}
        </button>
      </form>

      <p class="switch">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
        <span @click="toggleMode">
          {{ mode === 'login' ? 'Sign up here!' : 'Login here!' }}
        </span>
      </p>

      <button class="close" @click="close">×</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirm = ref(false)

function close() {
  emit('close')
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  password.value = ''
  confirmPassword.value = ''
  showPassword.value = false
  showConfirm.value = false
}

function submit() {
  close()
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
  margin-bottom: 1em;
  color: var(--color-text-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  font-size: 0.85rem;
  color: var(--color-text-primary);
}

input {
  height: 2.5em;
  padding: 0 0.75em;
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  background: var(--color-background-primary);
  color: var(--color-text-primary);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.8em;
}

.eye {
  position: absolute;
  right: 0.75em;
  cursor: pointer;
  color: var(--color-text-primary);
  display: grid;
  place-items: center;
}

.eye :deep(svg) {
  width: 1.1em;
  height: 1.1em;
}

.submit {
  height: 2.5em;
  margin-top: 0.5em;
  background: var(--color-primary);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-primary);
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.switch {
  text-align: center;
  margin-top: 1em;
  font-size: 0.9rem;
  color: var(--color-text-primary);
}

.switch span {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
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
