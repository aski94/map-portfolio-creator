<template>
  <Header></Header>

  <section v-if="ready" class="layout">
    <AddTemplate @add-text="addTextTemplate" @open="onAddTemplateClick" />

    <main>
      <Toolbar :mode="mode" @update:mode="mode = $event"></Toolbar>

      <Showcase :general="general" :templates="templates" :styleEnabled="mode === 'style'"
        :deleteEnabled="mode === 'delete'" :selectedId="selectedId" @edit="onEditTemplate" @delete="onDeleteTemplate" />
    </main>

    <TemplateStyling v-if="mode === 'style' && selectedTemplate && isTextVariant(selectedTemplate.variant)"
      v-model="selectedTemplateStyle" />

    <ImageTemplateStyling v-else-if="mode === 'style' && selectedTemplate && isImageVariant(selectedTemplate.variant)"
      v-model="selectedImageTemplateStyle" />

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
import ImageTemplateStyling from '@/components/ImageTemplateStyling.vue'
import type { ImageTemplateStyle } from '@/components/ImageTemplateStyling.vue'
import TemplatePicker from '@/components/TemplatePicker.vue'
import { useAuth } from '@/auth/auth'
import { textComponents } from '@/components/templates/text'
import { imageComponents } from '@/components/templates/image'

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

const defaultImageTemplateStyle: ImageTemplateStyle = {
  src: '',
  caption: '',
  align: 'left',
  widthPct: 25,
  padTop: 0,
  padRight: 0,
  padBottom: 0,
  padLeft: 0,
  hasImage: false,
}

const { token } = useAuth()

const ready = ref(false)
const mode = ref<Mode>('general')

const showTemplatePicker = ref(false)
const pickedTemplateType = ref('')

const templates = ref<Array<{ id: string; variant: string; props: Record<string, any> }>>([])
const selectedId = ref('')

const selectedTemplate = computed(() => templates.value.find((t) => t.id === selectedId.value) ?? null)

const textVariantSet = new Set(textComponents.map((t) => t.variant))
const imageVariantSet = new Set(imageComponents.map((t) => t.variant))

function isTextVariant(variant: string) {
  return textVariantSet.has(variant)
}

function isImageVariant(variant: string) {
  return imageVariantSet.has(variant)
}

const selectedTemplateStyle = computed<TemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isTextVariant(t.variant)) return defaultTemplateStyle

    return {
      title: (t.props as any).title ?? defaultTemplateStyle.title,
      text: (t.props as any).text ?? defaultTemplateStyle.text,
      align: ((t.props as any).style?.align ?? defaultTemplateStyle.align) as TemplateStyle['align'],
      gapHeadingText: ((t.props as any).style?.gapHeadingText ?? defaultTemplateStyle.gapHeadingText) as number,
      padTop: ((t.props as any).style?.padTop ?? defaultTemplateStyle.padTop) as number,
      padRight: ((t.props as any).style?.padRight ?? defaultTemplateStyle.padRight) as number,
      padBottom: ((t.props as any).style?.padBottom ?? defaultTemplateStyle.padBottom) as number,
      padLeft: ((t.props as any).style?.padLeft ?? defaultTemplateStyle.padLeft) as number,
      marTop: ((t.props as any).style?.marTop ?? defaultTemplateStyle.marTop) as number,
      marRight: ((t.props as any).style?.marRight ?? defaultTemplateStyle.marRight) as number,
      marBottom: ((t.props as any).style?.marBottom ?? defaultTemplateStyle.marBottom) as number,
      marLeft: ((t.props as any).style?.marLeft ?? defaultTemplateStyle.marLeft) as number,
      textColor: ((t.props as any).style?.textColor ?? defaultTemplateStyle.textColor) as string,
      headingColor: ((t.props as any).style?.headingColor ?? defaultTemplateStyle.headingColor) as string,
      bgColor: ((t.props as any).style?.bgColor ?? defaultTemplateStyle.bgColor) as string,
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t || !isTextVariant(t.variant)) return

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

const selectedImageTemplateStyle = computed<ImageTemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isImageVariant(t.variant)) return defaultImageTemplateStyle

    return {
      src: (t.props as any).src ?? defaultImageTemplateStyle.src,
      caption: (t.props as any).caption ?? defaultImageTemplateStyle.caption,
      align: ((t.props as any).style?.align ?? defaultImageTemplateStyle.align) as ImageTemplateStyle['align'],
      widthPct: ((t.props as any).style?.widthPct ?? defaultImageTemplateStyle.widthPct) as number,
      padTop: ((t.props as any).style?.padTop ?? defaultImageTemplateStyle.padTop) as number,
      padRight: ((t.props as any).style?.padRight ?? defaultImageTemplateStyle.padRight) as number,
      padBottom: ((t.props as any).style?.padBottom ?? defaultImageTemplateStyle.padBottom) as number,
      padLeft: ((t.props as any).style?.padLeft ?? defaultImageTemplateStyle.padLeft) as number,
      hasImage: Boolean((t.props as any).src),
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t || !isImageVariant(t.variant)) return

      ; (t.props as any).src = v.src
      ; (t.props as any).caption = v.caption
      ; (t.props as any).style = {
        align: v.align,
        widthPct: v.widthPct,
        padTop: v.padTop,
        padRight: v.padRight,
        padBottom: v.padBottom,
        padLeft: v.padLeft,
      }
  },
})

watch(mode, (m) => {
  if (m !== 'style' && m !== 'delete') selectedId.value = ''
})

const general = reactive({
  pad: 32,
  gap: 20,
  font: 'Inter, system-ui, sans-serif',
  hSize: 28,
  tSize: 16,
  text: '#111111',
  heading: '#000000',
  accent: '#4f46e5',
  bg: '#ffffff',
})

function onAddTemplateClick(templateType: string) {
  if (templateType === 'image') {
    addImageTemplate()
    return
  }

  pickedTemplateType.value = templateType
  showTemplatePicker.value = true
}

function onEditTemplate(id: string) {
  selectedId.value = id
}

function onDeleteTemplate(id: string) {
  templates.value = templates.value.filter((t) => t.id !== id)
  if (selectedId.value === id) selectedId.value = ''
}

function normalizeCreatedTemplate(created: { id: string; variant: string; props: Record<string, any> }) {
  if (isTextVariant(created.variant)) {
    ; (created.props as any).title = (created.props as any).title ?? defaultTemplateStyle.title
      ; (created.props as any).text = (created.props as any).text ?? defaultTemplateStyle.text
      ; (created.props as any).style =
        (created.props as any).style ??
        {
          align: defaultTemplateStyle.align,
          gapHeadingText: defaultTemplateStyle.gapHeadingText,
          padTop: defaultTemplateStyle.padTop,
          padRight: defaultTemplateStyle.padRight,
          padBottom: defaultTemplateStyle.padBottom,
          padLeft: defaultTemplateStyle.padLeft,
          marTop: defaultTemplateStyle.marTop,
          marRight: defaultTemplateStyle.marRight,
          marBottom: defaultTemplateStyle.marBottom,
          marLeft: defaultTemplateStyle.marLeft,
          textColor: defaultTemplateStyle.textColor,
          headingColor: defaultTemplateStyle.headingColor,
          bgColor: defaultTemplateStyle.bgColor,
        }
  }

  if (isImageVariant(created.variant)) {
    ; (created.props as any).src = (created.props as any).src ?? defaultImageTemplateStyle.src
      ; (created.props as any).caption = (created.props as any).caption ?? defaultImageTemplateStyle.caption
      ; (created.props as any).style =
        (created.props as any).style ??
        {
          align: defaultImageTemplateStyle.align,
          widthPct: defaultImageTemplateStyle.widthPct,
          padTop: defaultImageTemplateStyle.padTop,
          padRight: defaultImageTemplateStyle.padRight,
          padBottom: defaultImageTemplateStyle.padBottom,
          padLeft: defaultImageTemplateStyle.padLeft,
        }
  }

  return created
}

function addTextTemplate() {
  const def = textComponents[0]
  if (!def) return

  templates.value.push(
    normalizeCreatedTemplate({
      id: crypto.randomUUID(),
      variant: def.variant,
      props: def.createDefaultProps(),
    }),
  )
}

function addImageTemplate() {
  const def = imageComponents[0]
  if (!def) return

  templates.value.push(
    normalizeCreatedTemplate({
      id: crypto.randomUUID(),
      variant: def.variant,
      props: def.createDefaultProps(),
    }),
  )
}

function onTemplateVariantSelect(variant: string) {
  const def = textComponents.find((t) => t.variant === variant)
  if (!def) return

  templates.value.push(
    normalizeCreatedTemplate({
      id: crypto.randomUUID(),
      variant,
      props: def.createDefaultProps(),
    }),
  )
}

async function loadPortfolio() {
  const t = token()
  if (!t) {
    ready.value = true
    return
  }

  try {
    const res = await fetch('http://localhost:3000/portfolio/me', {
      headers: { Authorization: `Bearer ${t}` },
    })

    const json = await res.json().catch(() => null)
    const data = json?.data

    if (data?.general) Object.assign(general, data.general)
    if (Array.isArray(data?.templates)) templates.value = data.templates
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
    body: JSON.stringify({ general, templates: templates.value }),
  })
}

let saveTimeout: number | null = null

function queueSave() {
  if (saveTimeout) window.clearTimeout(saveTimeout)
  saveTimeout = window.setTimeout(() => {
    savePortfolio()
  }, 400)
}

function updateGeneral(v: typeof general) {
  Object.assign(general, v)
  queueSave()
}

watch(
  templates,
  () => {
    queueSave()
  },
  { deep: true },
)

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
