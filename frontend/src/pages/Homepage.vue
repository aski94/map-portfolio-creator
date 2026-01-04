<template>
  <Header></Header>

  <section v-if="ready" class="layout">
    <AddTemplate @open="openTemplatePicker" />

    <main>
      <Toolbar></Toolbar>
      <Showcase :general="general" :templates="templates"></Showcase>
    </main>

    <Styling :general="general" @update:general="updateGeneral" />
  </section>

  <TemplatePicker v-if="showTemplatePicker" :templateType="pickedTemplateType" @close="showTemplatePicker = false"
    @select="onTemplateVariantSelect" />
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import AddTemplate from '@/components/AddTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import Showcase from '@/components/Showcase.vue'
import Styling from '@/components/Styling.vue'
import TemplatePicker from '@/components/TemplatePicker.vue'
import { useAuth } from '@/auth/auth'
import { textComponents } from '@/components/templates/text'

const { token } = useAuth()

const ready = ref(false)

const showTemplatePicker = ref(false)
const pickedTemplateType = ref('')

const templates = ref<Array<{ id: string; variant: string; props: Record<string, any> }>>([])

const general = reactive({
  pad: 32,
  gap: 20,
  font: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  hSize: 28,
  tSize: 16,
  text: '#111111',
  heading: '#000000',
  accent: '#4f46e5',
  bg: '#ffffff',
})

function openTemplatePicker(templateType: string) {
  pickedTemplateType.value = templateType
  showTemplatePicker.value = true
}

function onTemplateVariantSelect(variant: string) {
  const def = textComponents.find(t => t.variant === variant)
  if (!def) return

  templates.value.push({
    id: crypto.randomUUID(),
    variant,
    props: def.createDefaultProps(),
  })
  // console.log(pickedTemplateType.value, variant)
}

async function loadPortfolio() {
  const t = token()
  if (!t) {
    ready.value = true
    return
  }

  try {
    const res = await fetch('http://localhost:3000/portfolio/me', {
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })

    const data = await res.json().catch(() => null)
    if (data?.ok && data?.data?.general) {
      Object.assign(general, data.data.general)
    }
  } finally {
    ready.value = true
  }
}

async function savePortfolio() {
  const t = token()
  if (!t) return

  await fetch('http://localhost:3000/portfolio/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify({
      general,
    }),
  })
}

let saveTimeout: number | null = null

function updateGeneral(v: typeof general) {
  Object.assign(general, v)

  if (saveTimeout) window.clearTimeout(saveTimeout)

  saveTimeout = window.setTimeout(() => {
    savePortfolio()
  }, 400)
}

onMounted(() => {
  loadPortfolio()
})
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
