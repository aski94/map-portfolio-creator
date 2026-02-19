<template>
  <Header></Header>

  <section v-if="ready" class="layout">
    <AddTemplate @add-text="addTextTemplate" @open="onAddTemplateClick" />

    <main>
      <Toolbar :mode="mode" @update:mode="mode = $event"></Toolbar>

      <Showcase :general="general" :templates="templates" :styleEnabled="mode === 'style'"
        :deleteEnabled="mode === 'delete'" :reorderEnabled="mode === 'reorder'" :selectedId="selectedId"
        @edit="onEditTemplate" @delete="onDeleteTemplate" @move="onMoveTemplate" />
    </main>

    <TextStyling v-if="mode === 'style' && selectedTemplate && isTextVariant(selectedTemplate.variant)"
      v-model="selectedTemplateStyle" />

    <ImageTemplateStyling v-else-if="mode === 'style' && selectedTemplate && isImageVariant(selectedTemplate.variant)"
      v-model="selectedImageTemplateStyle" />

    <ProjectsStyling v-else-if="mode === 'style' && selectedTemplate && isProjectVariant(selectedTemplate.variant)"
      v-model="selectedProjectsTemplateStyle" />

    <GalleryStyling v-else-if="mode === 'style' && selectedTemplate && isGalleryVariant(selectedTemplate.variant)"
      v-model="selectedGalleryTemplateStyle" />

    <ContactStyling v-else-if="mode === 'style' && selectedTemplate && isContactVariant(selectedTemplate.variant)"
      v-model="selectedContactTemplateStyle" />

    <Styling v-else :general="general" @update:general="updateGeneral" />
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed, watch } from 'vue'
import Header from '@/components/Header.vue'
import AddTemplate from '@/components/AddTemplate.vue'
import Toolbar from '@/components/Toolbar.vue'
import Showcase from '@/components/Showcase.vue'
import Styling from '@/components/GeneralStyling.vue'
import TextStyling from '@/components/TextStyling.vue'
import ImageTemplateStyling from '@/components/ImageTemplateStyling.vue'
import type { ImageTemplateStyle } from '@/components/ImageTemplateStyling.vue'
import ProjectsStyling from '@/components/ProjectsStyling.vue'
import type { ProjectsTemplateStyle } from '@/components/ProjectsStyling.vue'
import GalleryStyling from '@/components/GalleryStyling.vue'
import type { GalleryTemplateStyle } from '@/components/GalleryStyling.vue'
import ContactStyling from '@/components/ContactStyling.vue'
import type { ContactTemplateStyle } from '@/components/ContactStyling.vue'
import { useAuth } from '@/auth/auth'
import { textComponents } from '@/components/templates/text'
import { imageComponents } from '@/components/templates/image'
import { projectComponents } from '@/components/templates/projects'
import { galleryComponents } from '@/components/templates/gallery'
import { contactComponents } from '@/components/templates/contact'

type Mode = 'general' | 'style' | 'reorder' | 'delete'
type TemplateInstance = { id: string; variant: string; props: Record<string, any> }

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

const defaultProjectsTemplateStyle: ProjectsTemplateStyle = {
  heading: 'Projects',
  layout: 'grid',
  padTop: 0,
  padRight: 0,
  padBottom: 0,
  padLeft: 0,
  projects: [],
}

const defaultGalleryTemplateStyle: GalleryTemplateStyle = {
  heading: 'Gallery',
  layout: 'grid',
  columns: 3,
  gap: 8,
  imageHeight: 200,
  padTop: 0,
  padRight: 0,
  padBottom: 0,
  padLeft: 0,
  items: [],
}

const defaultContactTemplateStyle: ContactTemplateStyle = {
  heading: 'Contact',
  name: '',
  role: '',
  bio: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  website: '',
  linkedin: '',
  github: '',
  skills: '',
  languages: '',
  specialization: '',
  education: [],
  experience: [],
  imageSrc: '',
  photoFit: 'cover',
  photoSize: 160,
  photoPosX: 50,
  photoPosY: 50,
  showPhoto: true,
  showName: true,
  showRole: true,
  showBio: true,
  showEmail: true,
  showPhone: true,
  showAddress: true,
  showCity: true,
  showCountry: true,
  showWebsite: true,
  showLinkedin: true,
  showGithub: true,
  showSkills: true,
  showLanguages: true,
  showSpecialization: true,
  showEducation: true,
  showExperience: true,
  padTop: 0,
  padRight: 0,
  padBottom: 0,
  padLeft: 0,
}

function makeDefaultProject() {
  return {
    id: crypto.randomUUID(),
    title: 'Project name',
    description: 'Short description of what you built.',
    tags: ['Tag 1', 'Tag 2'],
    imageSrc: '',
    imageFit: 'cover' as const,
    imageHeight: 200,
    imagePosX: 50,
    imagePosY: 50,
    github: '',
    other: '',
  }
}

function makeDefaultGalleryItem() {
  return {
    id: crypto.randomUUID(),
    imageSrc: '',
    imageFit: 'cover' as const,
    imagePosX: 50,
    imagePosY: 50,
  }
}

const { token } = useAuth()

const ready = ref(false)
const mode = ref<Mode>('general')
const templates = ref<TemplateInstance[]>([])
const selectedId = ref('')

const selectedTemplate = computed<TemplateInstance | null>(
  () => templates.value.find((t) => t.id === selectedId.value) ?? null,
)

type TextVariant = (typeof textComponents)[number]['variant']
type ImageVariant = (typeof imageComponents)[number]['variant']
type ProjectVariant = (typeof projectComponents)[number]['variant']
type GalleryVariant = (typeof galleryComponents)[number]['variant']
type ContactVariant = (typeof contactComponents)[number]['variant']

const textVariantSet = new Set<TextVariant>(textComponents.map((t) => t.variant))
const imageVariantSet = new Set<ImageVariant>(imageComponents.map((t) => t.variant))
const projectVariantSet = new Set<ProjectVariant>(projectComponents.map((t) => t.variant))
const galleryVariantSet = new Set<GalleryVariant>(galleryComponents.map((t) => t.variant))
const contactVariantSet = new Set<ContactVariant>(contactComponents.map((t) => t.variant))

function isTextVariant(variant: string): variant is TextVariant {
  return textVariantSet.has(variant as TextVariant)
}

function isImageVariant(variant: string): variant is ImageVariant {
  return imageVariantSet.has(variant as ImageVariant)
}

function isProjectVariant(variant: string): variant is ProjectVariant {
  return projectVariantSet.has(variant as ProjectVariant)
}

function isGalleryVariant(variant: string): variant is GalleryVariant {
  return galleryVariantSet.has(variant as GalleryVariant)
}

function isContactVariant(variant: string): variant is ContactVariant {
  return contactVariantSet.has(variant as ContactVariant)
}

const selectedTemplateStyle = computed<TemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isTextVariant(t.variant)) return defaultTemplateStyle
    return {
      title: (t.props as any).title ?? defaultTemplateStyle.title,
      text: (t.props as any).text ?? defaultTemplateStyle.text,
      align: ((t.props as any).style?.align ?? defaultTemplateStyle.align) as any,
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
      align: ((t.props as any).style?.align ?? defaultImageTemplateStyle.align) as any,
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

const selectedProjectsTemplateStyle = computed<ProjectsTemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isProjectVariant(t.variant)) return defaultProjectsTemplateStyle
    const p = t.props as any
    const st = p.style ?? {}
    return {
      heading: (p.heading ?? defaultProjectsTemplateStyle.heading) as string,
      layout: (p.layout ?? defaultProjectsTemplateStyle.layout) as any,
      padTop: (st.padTop ?? defaultProjectsTemplateStyle.padTop) as number,
      padRight: (st.padRight ?? defaultProjectsTemplateStyle.padRight) as number,
      padBottom: (st.padBottom ?? defaultProjectsTemplateStyle.padBottom) as number,
      padLeft: (st.padLeft ?? defaultProjectsTemplateStyle.padLeft) as number,
      projects: (Array.isArray(p.projects) && p.projects.length ? p.projects : [makeDefaultProject()]) as any,
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t || !isProjectVariant(t.variant)) return
      ; (t.props as any).heading = v.heading
      ; (t.props as any).layout = v.layout
      ; (t.props as any).projects = v.projects
      ; (t.props as any).style = {
        padTop: v.padTop,
        padRight: v.padRight,
        padBottom: v.padBottom,
        padLeft: v.padLeft,
      }
  },
})

const selectedGalleryTemplateStyle = computed<GalleryTemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isGalleryVariant(t.variant)) return defaultGalleryTemplateStyle
    const p = t.props as any
    const st = p.style ?? {}
    return {
      heading: (p.heading ?? defaultGalleryTemplateStyle.heading) as string,
      layout: (p.layout ?? defaultGalleryTemplateStyle.layout) as any,
      columns: (st.columns ?? defaultGalleryTemplateStyle.columns) as number,
      gap: (st.gap ?? defaultGalleryTemplateStyle.gap) as number,
      imageHeight: (st.imageHeight ?? defaultGalleryTemplateStyle.imageHeight) as number,
      padTop: (st.padTop ?? defaultGalleryTemplateStyle.padTop) as number,
      padRight: (st.padRight ?? defaultGalleryTemplateStyle.padRight) as number,
      padBottom: (st.padBottom ?? defaultGalleryTemplateStyle.padBottom) as number,
      padLeft: (st.padLeft ?? defaultGalleryTemplateStyle.padLeft) as number,
      items: (Array.isArray(p.items) && p.items.length ? p.items : [makeDefaultGalleryItem()]) as any,
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t || !isGalleryVariant(t.variant)) return
      ; (t.props as any).heading = v.heading
      ; (t.props as any).layout = v.layout
      ; (t.props as any).items = v.items
      ; (t.props as any).style = {
        columns: v.columns,
        gap: v.gap,
        imageHeight: v.imageHeight,
        padTop: v.padTop,
        padRight: v.padRight,
        padBottom: v.padBottom,
        padLeft: v.padLeft,
      }
  },
})

const selectedContactTemplateStyle = computed<ContactTemplateStyle>({
  get() {
    const t = selectedTemplate.value
    if (!t || !isContactVariant(t.variant)) return defaultContactTemplateStyle
    const p = t.props as any
    const st = p.style ?? {}
    return {
      heading: (p.heading ?? defaultContactTemplateStyle.heading) as string,
      name: (p.name ?? defaultContactTemplateStyle.name) as string,
      role: (p.role ?? defaultContactTemplateStyle.role) as string,
      bio: (p.bio ?? defaultContactTemplateStyle.bio) as string,
      email: (p.email ?? defaultContactTemplateStyle.email) as string,
      phone: (p.phone ?? defaultContactTemplateStyle.phone) as string,
      address: (p.address ?? defaultContactTemplateStyle.address) as string,
      city: (p.city ?? defaultContactTemplateStyle.city) as string,
      country: (p.country ?? defaultContactTemplateStyle.country) as string,
      website: (p.website ?? defaultContactTemplateStyle.website) as string,
      linkedin: (p.linkedin ?? defaultContactTemplateStyle.linkedin) as string,
      github: (p.github ?? defaultContactTemplateStyle.github) as string,
      skills: (p.skills ?? defaultContactTemplateStyle.skills) as string,
      languages: (p.languages ?? defaultContactTemplateStyle.languages) as string,
      specialization: (p.specialization ?? defaultContactTemplateStyle.specialization) as string,
      education: (Array.isArray(p.education) ? p.education : []) as any,
      experience: (Array.isArray(p.experience) ? p.experience : []) as any,
      imageSrc: (p.imageSrc ?? defaultContactTemplateStyle.imageSrc) as string,
      photoFit: (p.photoFit ?? defaultContactTemplateStyle.photoFit) as any,
      photoSize: (p.photoSize ?? st.photoSize ?? defaultContactTemplateStyle.photoSize) as number,
      photoPosX: (p.photoPosX ?? defaultContactTemplateStyle.photoPosX) as number,
      photoPosY: (p.photoPosY ?? defaultContactTemplateStyle.photoPosY) as number,
      showPhoto: (p.showPhoto ?? defaultContactTemplateStyle.showPhoto) as boolean,
      showName: (p.showName ?? defaultContactTemplateStyle.showName) as boolean,
      showRole: (p.showRole ?? defaultContactTemplateStyle.showRole) as boolean,
      showBio: (p.showBio ?? defaultContactTemplateStyle.showBio) as boolean,
      showEmail: (p.showEmail ?? defaultContactTemplateStyle.showEmail) as boolean,
      showPhone: (p.showPhone ?? defaultContactTemplateStyle.showPhone) as boolean,
      showAddress: (p.showAddress ?? defaultContactTemplateStyle.showAddress) as boolean,
      showCity: (p.showCity ?? defaultContactTemplateStyle.showCity) as boolean,
      showCountry: (p.showCountry ?? defaultContactTemplateStyle.showCountry) as boolean,
      showWebsite: (p.showWebsite ?? defaultContactTemplateStyle.showWebsite) as boolean,
      showLinkedin: (p.showLinkedin ?? defaultContactTemplateStyle.showLinkedin) as boolean,
      showGithub: (p.showGithub ?? defaultContactTemplateStyle.showGithub) as boolean,
      showSkills: (p.showSkills ?? defaultContactTemplateStyle.showSkills) as boolean,
      showLanguages: (p.showLanguages ?? defaultContactTemplateStyle.showLanguages) as boolean,
      showSpecialization: (p.showSpecialization ?? defaultContactTemplateStyle.showSpecialization) as boolean,
      showEducation: (p.showEducation ?? defaultContactTemplateStyle.showEducation) as boolean,
      showExperience: (p.showExperience ?? defaultContactTemplateStyle.showExperience) as boolean,
      padTop: (st.padTop ?? defaultContactTemplateStyle.padTop) as number,
      padRight: (st.padRight ?? defaultContactTemplateStyle.padRight) as number,
      padBottom: (st.padBottom ?? defaultContactTemplateStyle.padBottom) as number,
      padLeft: (st.padLeft ?? defaultContactTemplateStyle.padLeft) as number,
    }
  },
  set(v) {
    const t = selectedTemplate.value
    if (!t || !isContactVariant(t.variant)) return
    const p = t.props as any
    p.heading = v.heading
    p.name = v.name
    p.role = v.role
    p.bio = v.bio
    p.email = v.email
    p.phone = v.phone
    p.address = v.address
    p.city = v.city
    p.country = v.country
    p.website = v.website
    p.linkedin = v.linkedin
    p.github = v.github
    p.skills = v.skills
    p.languages = v.languages
    p.specialization = v.specialization
    p.education = v.education
    p.experience = v.experience
    p.imageSrc = v.imageSrc
    p.photoFit = v.photoFit
    p.photoSize = v.photoSize
    p.photoPosX = v.photoPosX
    p.photoPosY = v.photoPosY
    p.showPhoto = v.showPhoto
    p.showName = v.showName
    p.showRole = v.showRole
    p.showBio = v.showBio
    p.showEmail = v.showEmail
    p.showPhone = v.showPhone
    p.showAddress = v.showAddress
    p.showCity = v.showCity
    p.showCountry = v.showCountry
    p.showWebsite = v.showWebsite
    p.showLinkedin = v.showLinkedin
    p.showGithub = v.showGithub
    p.showSkills = v.showSkills
    p.showLanguages = v.showLanguages
    p.showSpecialization = v.showSpecialization
    p.showEducation = v.showEducation
    p.showExperience = v.showExperience
    p.style = {
      padTop: v.padTop,
      padRight: v.padRight,
      padBottom: v.padBottom,
      padLeft: v.padLeft,
      photoSize: v.photoSize,
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
  if (templateType === 'image') return addImageTemplate()
  if (templateType === 'projects') return addProjectsTemplate()
  if (templateType === 'gallery') return addGalleryTemplate()
  if (templateType === 'contact') return addContactTemplate()
}

function onEditTemplate(id: string) {
  selectedId.value = id
}
function onDeleteTemplate(id: string) {
  templates.value = templates.value.filter((t) => t.id !== id)
  if (selectedId.value === id) selectedId.value = ''
}
function onMoveTemplate(id: string, dir: -1 | 1) {
  const from = templates.value.findIndex((t) => t.id === id)
  if (from < 0) return
  const to = from + dir
  if (to < 0 || to >= templates.value.length) return
  const list = templates.value.slice()
  const moved = list.splice(from, 1)[0]
  if (!moved) return
  list.splice(to, 0, moved)
  templates.value = list
}

function normalizeCreatedTemplate(created: TemplateInstance): TemplateInstance {
  if (isContactVariant(created.variant)) {
    const p = created.props as any
  }
  return created
}

function addTextTemplate() {
  const def = textComponents[0]
  if (!def) return
  templates.value.push({ id: crypto.randomUUID(), variant: def.variant, props: def.createDefaultProps() })
}
function addImageTemplate() {
  const def = imageComponents[0]
  if (!def) return
  templates.value.push({ id: crypto.randomUUID(), variant: def.variant, props: def.createDefaultProps() })
}
function addProjectsTemplate() {
  const def = projectComponents[0]
  if (!def) return
  templates.value.push({ id: crypto.randomUUID(), variant: def.variant, props: def.createDefaultProps() })
}
function addGalleryTemplate() {
  const def = galleryComponents[0]
  if (!def) return
  templates.value.push({ id: crypto.randomUUID(), variant: def.variant, props: def.createDefaultProps() })
}
function addContactTemplate() {
  const def = contactComponents[0]
  if (!def) return
  templates.value.push(
    normalizeCreatedTemplate({ id: crypto.randomUUID(), variant: def.variant, props: def.createDefaultProps() }),
  )
}

async function loadPortfolio() {
  const t = token()
  if (!t) {
    ready.value = true
    return
  }
  try {
    const res = await fetch('http://localhost:3000/portfolio/me', { headers: { Authorization: `Bearer ${t}` } })
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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify({ general, templates: templates.value }),
  })
}

let saveTimeout: number | null = null
function queueSave() {
  if (saveTimeout) window.clearTimeout(saveTimeout)
  saveTimeout = window.setTimeout(() => savePortfolio(), 400)
}
function updateGeneral(v: typeof general) {
  Object.assign(general, v)
  queueSave()
}

watch(templates, () => queueSave(), { deep: true })
onMounted(() => loadPortfolio())
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
