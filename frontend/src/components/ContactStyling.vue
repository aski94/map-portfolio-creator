<template>
    <aside>
        <h1 class="title">Contact styling</h1>

        <form class="form" @submit.prevent @input="onChange">
            <section class="field">
                <label for="heading">Heading</label>
                <input id="heading" type="text" v-model="local.heading" />
            </section>

            <section class="field">
                <label>Padding</label>
                <section class="quad">
                    <section class="quad-field">
                        <label for="padTop">Top</label>
                        <input id="padTop" type="range" min="0" max="96" v-model.number="local.padTop" />
                    </section>

                    <section class="quad-field">
                        <label for="padBottom">Bottom</label>
                        <input id="padBottom" type="range" min="0" max="96" v-model.number="local.padBottom" />
                    </section>

                    <section class="quad-field">
                        <label for="padLeft">Left</label>
                        <input id="padLeft" type="range" min="0" max="96" v-model.number="local.padLeft" />
                    </section>

                    <section class="quad-field">
                        <label for="padRight">Right</label>
                        <input id="padRight" type="range" min="0" max="96" v-model.number="local.padRight" />
                    </section>
                </section>
            </section>

            <section class="field">
                <label>Photo</label>

                <section class="segmented" role="group" aria-label="Show photo">
                    <button type="button" :class="{ active: !local.showPhoto }"
                        @click="local.showPhoto = false; onChange()">
                        Off
                    </button>
                    <button type="button" :class="{ active: local.showPhoto }"
                        @click="local.showPhoto = true; onChange()">
                        On
                    </button>
                </section>

                <template v-if="local.showPhoto">
                    <div class="row" style="margin-top: 0.6em">
                        <input ref="fileRef" class="file" type="file" accept="image/*" @change="onFile" />
                        <button type="button" class="file-btn" @click="fileRef?.click()">Select photo</button>
                        <p class="hint" v-if="local.imageSrc">Photo selected</p>
                        <p class="hint" v-else>No photo selected</p>
                    </div>

                    <div class="row">
                        <label>Image fit</label>
                        <section class="segmented" role="group" aria-label="Photo fit">
                            <button type="button" :class="{ active: (local.photoFit ?? 'cover') === 'cover' }"
                                @click="local.photoFit = 'cover'; onChange()">
                                Cover
                            </button>
                            <button type="button" :class="{ active: (local.photoFit ?? 'cover') === 'contain' }"
                                @click="local.photoFit = 'contain'; onChange()">
                                Contain
                            </button>
                        </section>
                    </div>

                    <!-- sliders like ProjectsStyling: size full width on top, X/Y below -->
                    <div class="row">
                        <section class="quad">
                            <section class="quad-field span-2">
                                <label for="photoSize">Image size — {{ local.photoSize ?? 160 }}px</label>
                                <input id="photoSize" type="range" min="80" max="320" step="5"
                                    v-model.number="local.photoSize" />
                            </section>

                            <section class="quad-field">
                                <label for="photoPosX">Image horizontal</label>
                                <input id="photoPosX" type="range" min="0" max="100" v-model.number="local.photoPosX" />
                            </section>

                            <section class="quad-field">
                                <label for="photoPosY">Image vertical</label>
                                <input id="photoPosY" type="range" min="0" max="100" v-model.number="local.photoPosY" />
                            </section>
                        </section>
                    </div>
                </template>
            </section>

            <section class="field">
                <label>Identity</label>

                <div class="row">
                    <label for="name">Name</label>
                    <input id="name" type="text" v-model="local.name" placeholder="Your name" />
                </div>

                <div class="row">
                    <label for="role">Role / Title</label>
                    <input id="role" type="text" v-model="local.role" placeholder="Your role" />
                </div>

                <div class="row">
                    <label for="bio">About</label>
                    <textarea id="bio" v-model="local.bio" placeholder="A short bio about you."></textarea>
                </div>
            </section>

            <section class="field">
                <label>Contact fields</label>

                <div class="row">
                    <label for="email">Email</label>
                    <input id="email" type="text" v-model="local.email" placeholder="email@example.com" />
                </div>

                <div class="row">
                    <label for="phone">Phone</label>
                    <input id="phone" type="text" v-model="local.phone" placeholder="+1 234 567 890" />
                </div>

                <div class="row">
                    <label for="address">Address</label>
                    <input id="address" type="text" v-model="local.address" placeholder="Street address" />
                </div>

                <div class="row">
                    <label for="city">City</label>
                    <input id="city" type="text" v-model="local.city" placeholder="City" />
                </div>

                <div class="row">
                    <label for="country">Country</label>
                    <input id="country" type="text" v-model="local.country" placeholder="Country" />
                </div>
            </section>

            <section class="field">
                <label>Online</label>

                <div class="row">
                    <label for="website">Website</label>
                    <input id="website" type="url" v-model="local.website" placeholder="https://..." />
                </div>

                <div class="row">
                    <label for="linkedin">LinkedIn</label>
                    <input id="linkedin" type="url" v-model="local.linkedin"
                        placeholder="https://linkedin.com/in/..." />
                </div>

                <div class="row">
                    <label for="github">GitHub</label>
                    <input id="github" type="url" v-model="local.github" placeholder="https://github.com/..." />
                </div>
            </section>

            <section class="field">
                <label>Skills &amp; languages</label>

                <div class="row">
                    <label for="skills">Skills (comma separated)</label>
                    <input id="skills" type="text" v-model="local.skills" placeholder="e.g. Vue, TypeScript, Figma" />
                </div>

                <div class="row">
                    <label for="languages">Languages (comma separated)</label>
                    <input id="languages" type="text" v-model="local.languages" placeholder="e.g. English, Spanish" />
                </div>

                <div class="row">
                    <label for="specialization">Specialization</label>
                    <input id="specialization" type="text" v-model="local.specialization"
                        placeholder="Your specialization" />
                </div>
            </section>

            <section class="field">
                <label>Education</label>

                <div class="entries">
                    <div v-for="e in local.education" :key="e.id" class="entry">
                        <div class="row">
                            <label>Degree / program</label>
                            <input type="text" v-model="e.degree" placeholder="Degree / program" />
                        </div>

                        <div class="row">
                            <label>Institution</label>
                            <input type="text" v-model="e.institution" placeholder="Institution" />
                        </div>

                        <div class="row">
                            <label>Years</label>
                            <input type="text" v-model="e.years" placeholder="Years" />
                        </div>

                        <button type="button" class="danger" @click="removeEntry('education', e.id)">Remove</button>
                    </div>

                    <button type="button" class="add" @click="addEntry('education')">Add education</button>
                </div>
            </section>

            <section class="field">
                <label>Experience</label>

                <div class="entries">
                    <div v-for="e in local.experience" :key="e.id" class="entry">
                        <div class="row">
                            <label>Role / position</label>
                            <input type="text" v-model="e.position" placeholder="Role / position" />
                        </div>

                        <div class="row">
                            <label>Company</label>
                            <input type="text" v-model="e.company" placeholder="Company" />
                        </div>

                        <div class="row">
                            <label>Years</label>
                            <input type="text" v-model="e.years" placeholder="Years" />
                        </div>

                        <button type="button" class="danger" @click="removeEntry('experience', e.id)">Remove</button>
                    </div>

                    <button type="button" class="add" @click="addEntry('experience')">Add experience</button>
                </div>
            </section>

            <section class="field">
                <label>Visible fields</label>

                <div class="toggles">
                    <section class="toggle-row" v-for="f in toggleFields" :key="f.key">
                        <span class="toggle-label">{{ f.label }}</span>
                        <section class="segmented mini" role="group">
                            <button type="button" :class="{ active: !local[f.key] }"
                                @click="local[f.key] = false; onChange()">
                                Off
                            </button>
                            <button type="button" :class="{ active: local[f.key] }"
                                @click="local[f.key] = true; onChange()">
                                On
                            </button>
                        </section>
                    </section>
                </div>
            </section>
        </form>
    </aside>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

export type ContactEducationEntry = { id: string; degree: string; institution: string; years: string }
export type ContactExperienceEntry = { id: string; position: string; company: string; years: string }

export type ContactTemplateStyle = {
    heading: string
    name: string
    role: string
    bio: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    website: string
    linkedin: string
    github: string
    skills: string
    languages: string
    specialization: string
    education: ContactEducationEntry[]
    experience: ContactExperienceEntry[]
    imageSrc: string
    photoFit: 'cover' | 'contain'
    photoSize: number
    photoPosX: number
    photoPosY: number
    showPhoto: boolean
    showName: boolean
    showRole: boolean
    showBio: boolean
    showEmail: boolean
    showPhone: boolean
    showAddress: boolean
    showCity: boolean
    showCountry: boolean
    showWebsite: boolean
    showLinkedin: boolean
    showGithub: boolean
    showSkills: boolean
    showLanguages: boolean
    showSpecialization: boolean
    showEducation: boolean
    showExperience: boolean
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
}

const toggleFields: {
    key: keyof Pick<
        ContactTemplateStyle,
        | 'showName'
        | 'showRole'
        | 'showBio'
        | 'showEmail'
        | 'showPhone'
        | 'showAddress'
        | 'showCity'
        | 'showCountry'
        | 'showWebsite'
        | 'showLinkedin'
        | 'showGithub'
        | 'showSkills'
        | 'showLanguages'
        | 'showSpecialization'
        | 'showEducation'
        | 'showExperience'
    >
    label: string
}[] = [
        { key: 'showName', label: 'Name' },
        { key: 'showRole', label: 'Role' },
        { key: 'showBio', label: 'About' },
        { key: 'showEmail', label: 'Email' },
        { key: 'showPhone', label: 'Phone' },
        { key: 'showAddress', label: 'Address' },
        { key: 'showCity', label: 'City' },
        { key: 'showCountry', label: 'Country' },
        { key: 'showWebsite', label: 'Website' },
        { key: 'showLinkedin', label: 'LinkedIn' },
        { key: 'showGithub', label: 'GitHub' },
        { key: 'showSkills', label: 'Skills' },
        { key: 'showLanguages', label: 'Languages' },
        { key: 'showSpecialization', label: 'Specialization' },
        { key: 'showEducation', label: 'Education' },
        { key: 'showExperience', label: 'Experience' },
    ]

const props = defineProps<{ modelValue: ContactTemplateStyle }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: ContactTemplateStyle): void }>()

const local = reactive<ContactTemplateStyle>({
    ...props.modelValue,
    education: [...(props.modelValue.education ?? [])],
    experience: [...(props.modelValue.experience ?? [])],
})

watch(
    () => props.modelValue,
    (v) =>
        Object.assign(local, {
            ...v,
            education: [...(v.education ?? [])],
            experience: [...(v.experience ?? [])],
        }),
    { deep: true, immediate: true },
)

const fileRef = ref<HTMLInputElement | null>(null)

function onChange() {
    emit('update:modelValue', {
        ...local,
        education: local.education.map((e) => ({ ...e })),
        experience: local.experience.map((e) => ({ ...e })),
    })
}

function addEntry(type: 'education' | 'experience') {
    if (type === 'education') {
        local.education.push({ id: crypto.randomUUID(), degree: '', institution: '', years: '' })
    } else {
        local.experience.push({ id: crypto.randomUUID(), position: '', company: '', years: '' })
    }
    onChange()
}

function removeEntry(type: 'education' | 'experience', id: string) {
    if (type === 'education') {
        local.education = local.education.filter((e) => e.id !== id) as any
    } else {
        local.experience = local.experience.filter((e) => e.id !== id) as any
    }
    onChange()
}

async function onFile(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(String(r.result ?? ''))
        r.onerror = () => reject(new Error('read error'))
        r.readAsDataURL(file)
    }).catch(() => '')

    if (!dataUrl) return

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error('img error'))
        el.src = dataUrl
    }).catch(() => null)

    if (!img) return

    const maxSide = 800
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0, w, h)
    local.imageSrc = canvas.toDataURL('image/jpeg', 0.85)
    onChange()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/Panel.scss';

aside {
    max-height: calc(100vh - 58px - 2em);
    overflow-y: auto;
}

textarea {
    height: 5rem;
    resize: none;
    overflow-y: auto;
}

.file {
    display: none;
}

.file-btn {
    height: 2.5em;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    cursor: pointer;
    font-size: 1em;
    font-family: inherit;
    transition: background 0.2s ease, filter 0.2s ease;
}

.file-btn:hover {
    background: #f7f8fb;
    filter: brightness(var(--hover-brightness));
}

.hint {
    margin: 0.35em 0 0 0;
    opacity: 0.75;
    font-size: 0.9em;
}

.segmented {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    overflow: hidden;
}

.segmented button {
    height: 2.5em;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-primary);
    font-size: 1em;
    font-family: inherit;
    transition: background 0.15s ease;
}

.segmented button+button {
    border-left: var(--border-primary);
}

.segmented button:hover {
    background: #f7f8fb;
}

.segmented button.active {
    background: #f7f8fb;
}

.segmented.mini button {
    height: 2em;
    font-size: 0.85em;
    min-width: 2.5em;
}

.quad {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75em;
}

.quad-field {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}

.quad-field.span-2 {
    grid-column: 1 / -1;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    margin-bottom: 0.6em;
}

.row:last-child {
    margin-bottom: 0;
}

.entries {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
}

.entry {
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    padding: 0.9em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    background: var(--color-background-primary);
}

.toggles {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
}

.toggle-label {
    font-size: 0.95em;
}

.add,
.danger {
    height: 2.5em;
    width: 100%;
    border: var(--border-primary);
    border-radius: var(--border-radius-primary);
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    font-size: 1em;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s ease, filter 0.2s ease;
}

.add:hover,
.danger:hover {
    background: #f7f8fb;
    filter: brightness(var(--hover-brightness));
}
</style>
