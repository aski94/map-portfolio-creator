<template>
  <Header></Header>

  <section v-if="ready" class="layout">
    <AddTemplate @add-text="addTextTemplate" @open="openTemplatePicker" />

    <main>
      <Toolbar :mode="mode" @update:mode="mode = $event"></Toolbar>

      <Showcase :general="general" :templates="templates" :styleEnabled="mode === 'style'" :selectedId="selectedId"
        @edit="onEditTemplate" />
    </main>

    <TemplateStyling v-if="mode === 'style' && selectedTemplate" v-model="selectedTemplateStyle" />

    <Styling v-else :general="general" @update:general="updateGeneral" />
  </section>

  <TemplatePicker v-if="showTemplatePicker" :templateType="pickedTemplateType" @close="showTemplatePicker = false"
    @select="onTemplateVariantSelect" />
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed, watch } from 'vue'
import Header from '@/components/Header.vue'
import AddTemplate from '@/components/AddTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import Showcase from '@/components/Showcase.vue'
import Styling from '@/components/GeneralStyling.vue'
import TemplateStyling from '@/components/TemplateStyling.vue'
import TemplatePicker from '@/components/TemplatePicker.vue'
import { useAuth } from '@/auth/auth'
import { textComponents } from '@/components/templates/text'

type Mode = 'general' | 'style' | 'reorder' | 'delete'

type TemplateStyle = {
  title: string
  text: string
  align: 'left' | 'center' | 'right' | 'justify'
  gapHeadingText: number
  padTop: number
  padRight: number
  padBottom: number
  padLeft: number
  marTop: number
  marRight: number
  marBottom: number
  marLeft: number
  textColor: string
  headingColor: string
  bgColor: string
}

const defaultTemplateStyle: TemplateStyle = {
  title: 'Heading',
  text: 'Your text goes here.',
  align: 'left',
  gapHeadingText: 0,
  padTop: 0,
  padRight: 0,
  padBottom: 0,
  padLeft: 0,
  marTop: 0,
  marRight: 0,
  marBottom: 0,
  marLeft: 0,
  textColor: '#111111',
  headingColor: '#000000',
  bgColor: '#ffffff',
}

const { token } = useAuth()

const ready = ref(false)

const mode = ref<Mode>('general')

const showTemplatePicker = ref(false)
const pickedTemplateType = ref('')

const templates = ref<Array<{ id: string; variant: string; props: Record<string, any> }>>([])
const selectedId = ref('')

const selectedTemplate = computed(() => templates.value.find((t) => t.id === selectedId.value) ?? null)

watch(mode, (m) => {
  if (m !== 'style') selectedId.value = ''
})

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

const selectedTemplateStyle = computed<TemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t) {
      return {
        ...defaultTemplateStyle,
        textColor: general.text,
        headingColor: general.heading,
        bgColor: 'transparent',
      }
    }

    return {
      title: (t.props as any).title ?? defaultTemplateStyle.title,
      text: (t.props as any).text ?? defaultTemplateStyle.text,
      align: (((t.props as any).style?.align ?? defaultTemplateStyle.align) as TemplateStyle['align']),
      gapHeadingText: ((t.props as any).style?.gapHeadingText ?? defaultTemplateStyle.gapHeadingText) as number,
      padTop: ((t.props as any).style?.padTop ?? defaultTemplateStyle.padTop) as number,
      padRight: ((t.props as any).style?.padRight ?? defaultTemplateStyle.padRight) as number,
      padBottom: ((t.props as any).style?.padBottom ?? defaultTemplateStyle.padBottom) as number,
      padLeft: ((t.props as any).style?.padLeft ?? defaultTemplateStyle.padLeft) as number,
      marTop: ((t.props as any).style?.marTop ?? defaultTemplateStyle.marTop) as number,
      marRight: ((t.props as any).style?.marRight ?? defaultTemplateStyle.marRight) as number,
      marBottom: ((t.props as any).style?.marBottom ?? defaultTemplateStyle.marBottom) as number,
      marLeft: ((t.props as any).style?.marLeft ?? defaultTemplateStyle.marLeft) as number,
      textColor: ((t.props as any).style?.textColor ?? general.text) as string,
      headingColor: ((t.props as any).style?.headingColor ?? general.heading) as string,
      bgColor: ((t.props as any).style?.bgColor ?? 'transparent') as string,
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t) return

      ; (t.props as any).title = v.title
      ; (t.props as any).text = v.text
      ; (t.props as any).style = {
        align: v.align,
        gapHeadingText: v.gapHeadingText,
        padTop: v.padTop,
        padRight: v.padRight,
        padBottom: v.padBottom,
        padLeft: v.padLeft,
        marTop: v.marTop,
        marRight: v.marRight,
        marBottom: v.marBottom,
        marLeft: v.marLeft,
        textColor: v.textColor,
        headingColor: v.headingColor,
        bgColor: v.bgColor,
      }
  },
})

function openTemplatePicker(templateType: string) {
  pickedTemplateType.value = templateType
  showTemplatePicker.value = true
}

function onEditTemplate(id: string) {
  selectedId.value = id
}

function normalizeCreatedTemplate(created: { id: string; variant: string; props: Record<string, any> }) {
  ; (created.props as any).title = (created.props as any).title ?? defaultTemplateStyle.title
    ; (created.props as any).text = (created.props as any).text ?? defaultTemplateStyle.text
  return created
}

function addTextTemplate() {
  const def = textComponents[0]
  if (!def) return

  const created = normalizeCreatedTemplate({
    id: crypto.randomUUID(),
    variant: def.variant,
    props: def.createDefaultProps(),
  })

  templates.value.push(created)
}

function onTemplateVariantSelect(variant: string) {
  const def = textComponents.find((t) => t.variant === variant)
  if (!def) return

  const created = normalizeCreatedTemplate({
    id: crypto.randomUUID(),
    variant,
    props: def.createDefaultProps(),
  })

  templates.value.push(created)
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
