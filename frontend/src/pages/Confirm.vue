<template>
  <div class="wrap">
    <div class="card">
      <p class="title">Email confirmation</p>

      <p v-if="status === 'loading'" class="text">
        Verifying your email…
      </p>

      <p v-else-if="status === 'success'" class="text">
        Your email has been verified. You can now log in.
      </p>

      <p v-else class="text error">
        {{ errorMessage }}
      </p>

      <button class="btn" @click="goHome">
        Go to homepage
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('Verification failed.')

onMounted(async () => {
  const token = String(route.query.token || '')

  if (!token) {
    status.value = 'error'
    errorMessage.value = 'Missing token.'
    return
  }

  try {
    const res = await fetch(
      `http://localhost:3000/auth/confirm?token=${encodeURIComponent(token)}`,
    )
    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.ok) {
      status.value = 'error'
      errorMessage.value = data.error || 'Verification failed.'
      return
    }

    status.value = 'success'
  } catch {
    status.value = 'error'
    errorMessage.value = 'Network error. Is the backend running?'
  }
})

function goHome() {
  router.push('/')
}
</script>

<style scoped lang="scss">
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: var(--color-background-primary);
}

.card {
  width: 420px;
  max-width: 100%;
  border: var(--border-primary);
  border-radius: var(--border-radius-secondary);
  box-shadow: var(--box-shadow-secondary);
  padding: 24px;
  text-align: center;
  background: var(--color-background-primary);
}

.title {
  margin: 0 0 12px;
  font-weight: 800;
  font-size: 1.6rem;
  color: var(--color-text-primary);
}

.text {
  margin: 0 0 16px;
  color: var(--color-text-primary);
}

.error {
  color: #b91c1c;
}

.btn {
  height: 2.5em;
  padding: 0 1em;
  background: var(--color-primary);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-primary);
  border: none;
  cursor: pointer;
  font-weight: 700;
}
</style>
