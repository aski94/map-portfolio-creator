<template>
  <div class="overlay" @click.self="close">
    <section class="modal">
      <template v-if="step === 'form'">
        <p class="title">
          {{ mode === 'login' ? 'Login' : 'Sign up' }}
        </p>

        <form class="form" @submit.prevent="submit">
          <label v-if="mode === 'signup'" for="first-name">
            First name
            <input
              id="first-name"
              type="text"
              placeholder="Enter your first name…"
              v-model="firstName"
              required
            />
          </label>

          <label v-if="mode === 'signup'" for="last-name">
            Last name
            <input
              id="last-name"
              type="text"
              placeholder="Enter your last name…"
              v-model="lastName"
              required
            />
          </label>

          <label for="email">
            Email
            <input
              id="email"
              type="email"
              placeholder="Enter your email…"
              v-model="email"
              required
            />
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

          <p v-if="errorMessage" class="message error">
            {{ errorMessage }}
          </p>

          <button class="submit" :disabled="loading">
            {{ loading ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Create account') }}
          </button>
        </form>

        <p class="switch">
          {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
          <span @click="toggleMode">
            {{ mode === 'login' ? 'Sign up here!' : 'Login here!' }}
          </span>
        </p>
      </template>

      <template v-else>
        <p class="title">Confirm your email</p>

        <div class="confirm">
          <p class="confirm-text">
            We’ve sent a confirmation email to
          </p>

          <p class="confirm-email">
            {{ email }}
          </p>

          <p class="confirm-text">
            Please open your inbox and click the link to activate your account.
          </p>

          <button class="submit" @click="close">
            Got it
          </button>
        </div>
      </template>

      <button class="close" @click="close">×</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const mode = ref<'login' | 'signup'>('login')
const step = ref<'form' | 'confirm'>('form')

const firstName = ref('')
const lastName = ref('')

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirm = ref(false)

const loading = ref(false)
const errorMessage = ref('')

function close() {
  emit('close')
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  step.value = 'form'
  errorMessage.value = ''
  password.value = ''
  confirmPassword.value = ''
  firstName.value = ''
  lastName.value = ''
  showPassword.value = false
  showConfirm.value = false
}

async function submit() {
  errorMessage.value = ''

  if (mode.value === 'signup' && password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (mode.value === 'signup') {
    loading.value = true
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        errorMessage.value = data.error || 'Signup failed'
        return
      }

      step.value = 'confirm'
      password.value = ''
      confirmPassword.value = ''
    } catch {
      errorMessage.value = 'Network error. Is the backend running?'
    } finally {
      loading.value = false
    }
  } else {
    close()
  }
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

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.message {
  text-align: center;
  font-size: 0.9rem;
}

.message.error {
  color: #b91c1c;
}

.confirm {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  text-align: center;
}

.confirm-text {
  margin: 0;
}

.confirm-email {
  margin: 0;
  font-weight: 800;
  color: var(--color-primary);
  word-break: break-word;
}
</style>
