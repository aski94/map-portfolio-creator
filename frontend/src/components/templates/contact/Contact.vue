<template>
    <section class="wrap" :style="rootStyle">
        <header class="top" v-if="heading">
            <p class="heading">{{ heading }}</p>
        </header>

        <section class="card">
            <div class="intro">
                <div class="intro-main">
                    <div v-if="showName" class="name-block">
                        <p class="name">{{ name || 'Your name' }}</p>
                        <p v-if="showRole" class="role">{{ role || 'Your role' }}</p>
                    </div>

                    <p v-if="showBio" class="bio">
                        {{ bio || 'A short bio about you.' }}
                    </p>
                </div>

                <div v-if="showPhoto" class="photo-col">
                    <div v-if="imageSrc" class="photo-wrap">
                        <img class="photo" :src="imageSrc" :alt="name ?? ''" :style="{
                            objectFit: photoFit ?? 'cover',
                            objectPosition: `${photoPosX ?? 50}% ${photoPosY ?? 50}%`,
                        }" />
                    </div>
                    <div v-else class="photo-wrap placeholder">
                        <span>Select a photo in the styling panel</span>
                    </div>
                </div>
            </div>

            <div v-if="hasContactFields" class="section">
                <p class="section-label">Contact</p>

                <div v-if="showEmail" class="field">
                    <p class="k">Email</p>
                    <p class="v">{{ email || 'email@example.com' }}</p>
                </div>

                <div v-if="showPhone" class="field">
                    <p class="k">Phone</p>
                    <p class="v">{{ phone || '+1 234 567 890' }}</p>
                </div>

                <div v-if="showAddress" class="field">
                    <p class="k">Address</p>
                    <p class="v">{{ address || 'Street address' }}</p>
                </div>

                <div v-if="showCity" class="field">
                    <p class="k">City</p>
                    <p class="v">{{ city || 'City' }}</p>
                </div>

                <div v-if="showCountry" class="field">
                    <p class="k">Country</p>
                    <p class="v">{{ country || 'Country' }}</p>
                </div>

                <div v-if="showWebsite" class="field">
                    <p class="k">Website</p>
                    <a v-if="website" class="v link" :href="website" target="_blank" rel="noreferrer">{{ website }}</a>
                    <p v-else class="v">Your website</p>
                </div>

                <div v-if="showLinkedin" class="field">
                    <p class="k">LinkedIn</p>
                    <a v-if="linkedin" class="v link" :href="linkedin" target="_blank" rel="noreferrer">{{ linkedin
                        }}</a>
                    <p v-else class="v">Your LinkedIn</p>
                </div>

                <div v-if="showGithub" class="field">
                    <p class="k">GitHub</p>
                    <a v-if="github" class="v link" :href="github" target="_blank" rel="noreferrer">{{ github }}</a>
                    <p v-else class="v">Your GitHub</p>
                </div>
            </div>

            <div v-if="hasSkillFields" class="section">
                <p class="section-label">Skills &amp; languages</p>

                <div v-if="showSpecialization" class="field full">
                    <p class="k">Specialization</p>
                    <p class="v">{{ specialization || 'Your specialization' }}</p>
                </div>

                <div v-if="showSkills" class="field full">
                    <p class="k">Skills</p>
                    <div class="tags" v-if="skillList.length">
                        <span class="tag" v-for="s in skillList" :key="s">{{ s }}</span>
                    </div>
                    <p v-else class="v">Add skills</p>
                </div>

                <div v-if="showLanguages" class="field full">
                    <p class="k">Languages</p>
                    <div class="tags" v-if="languageList.length">
                        <span class="tag" v-for="l in languageList" :key="l">{{ l }}</span>
                    </div>
                    <p v-else class="v">Add languages</p>
                </div>
            </div>

            <div v-if="showEducation" class="section">
                <p class="section-label">Education</p>
                <template v-if="education?.length">
                    <div v-for="e in education" :key="e.id" class="timeline-entry">
                        <div class="timeline-main">
                            <p class="timeline-title">{{ e.degree }}</p>
                            <p class="timeline-sub">{{ e.institution }}</p>
                        </div>
                        <p class="timeline-years">{{ e.years }}</p>
                    </div>
                </template>
                <p v-else class="empty">Add education entries</p>
            </div>

            <div v-if="showExperience" class="section">
                <p class="section-label">Experience</p>
                <template v-if="experience?.length">
                    <div v-for="e in experience" :key="e.id" class="timeline-entry">
                        <div class="timeline-main">
                            <p class="timeline-title">{{ e.position }}</p>
                            <p class="timeline-sub">{{ e.company }}</p>
                        </div>
                        <p class="timeline-years">{{ e.years }}</p>
                    </div>
                </template>
                <p v-else class="empty">Add experience entries</p>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ContactStyle = {
    padTop: number
    padRight: number
    padBottom: number
    padLeft: number
    photoSize: number
}

export type ContactEducationEntry = { id: string; degree: string; institution: string; years: string }
export type ContactExperienceEntry = { id: string; position: string; company: string; years: string }

const props = defineProps<{
    heading?: string
    name?: string
    role?: string
    bio?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
    website?: string
    linkedin?: string
    github?: string
    skills?: string
    languages?: string
    specialization?: string
    education?: ContactEducationEntry[]
    experience?: ContactExperienceEntry[]
    imageSrc?: string
    photoFit?: 'cover' | 'contain'
    photoPosX?: number
    photoPosY?: number
    showName?: boolean
    showRole?: boolean
    showBio?: boolean
    showEmail?: boolean
    showPhone?: boolean
    showAddress?: boolean
    showCity?: boolean
    showCountry?: boolean
    showWebsite?: boolean
    showLinkedin?: boolean
    showGithub?: boolean
    showSkills?: boolean
    showLanguages?: boolean
    showSpecialization?: boolean
    showEducation?: boolean
    showExperience?: boolean
    showPhoto?: boolean
    style?: Partial<ContactStyle>
}>()

const s = computed<ContactStyle>(() => ({
    padTop: props.style?.padTop ?? 0,
    padRight: props.style?.padRight ?? 0,
    padBottom: props.style?.padBottom ?? 0,
    padLeft: props.style?.padLeft ?? 0,
    photoSize: props.style?.photoSize ?? 160,
}))

const rootStyle = computed(() => ({
    padding: `${s.value.padTop}px ${s.value.padRight}px ${s.value.padBottom}px ${s.value.padLeft}px`,
    borderRadius: 'var(--border-radius-secondary)',
    '--photo-size': `${s.value.photoSize}px`,
}))

const skillList = computed(() => (props.skills ?? '').split(',').map((x) => x.trim()).filter(Boolean))
const languageList = computed(() => (props.languages ?? '').split(',').map((x) => x.trim()).filter(Boolean))

const hasContactFields = computed(
    () =>
        props.showEmail ||
        props.showPhone ||
        props.showAddress ||
        props.showCity ||
        props.showCountry ||
        props.showWebsite ||
        props.showLinkedin ||
        props.showGithub,
)

const hasSkillFields = computed(() => props.showSpecialization || props.showSkills || props.showLanguages)
</script>

<style scoped lang="scss">
.wrap {
    width: 100%;
}

.top {
    margin-bottom: 1rem;
}

.heading {
    margin: 0;
    font-weight: 800;
    font-size: 1.25rem;
}

.card {
    border: var(--border-primary);
    border-radius: var(--border-radius-secondary);
    background: var(--color-background-primary);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    gap: 1.1rem;
}

.intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--photo-size);
    column-gap: 1.25rem;
    align-items: start;
}

.intro-main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.photo-col {
    justify-self: end;
    align-self: start;
}

.photo-wrap {
    width: var(--photo-size);
    height: var(--photo-size);
    border-radius: var(--border-radius-primary);
    overflow: hidden;
    border: var(--border-primary);
    background: var(--color-background-primary);
    filter: brightness(var(--hover-brightness));
}

.photo-wrap.placeholder {
    display: grid;
    place-items: center;
    text-align: center;
    padding: 0.5rem;
    font-size: 0.8em;
    color: var(--color-text-primary);
}

.photo {
    width: 100%;
    height: 100%;
    display: block;
}

.name-block {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.name {
    margin: 0;
    font-weight: 800;
    font-size: 1.6rem !important;
    line-height: 1.2;
}

.role {
    margin: 0;
    opacity: 0.6;
    font-size: 0.95em;
}

.bio {
    margin: 0;
    opacity: 0.85;
    line-height: 1.55;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.section {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem 1.5rem;
    padding-top: 0.85rem;
    border-top: var(--border-primary);
}

.section-label {
    grid-column: 1 / -1;
    margin: 0 0 0.1rem 0;
    font-size: 0.78em;
    opacity: 0.5;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}

.field.full {
    grid-column: 1 / -1;
}

.k {
    margin: 0;
    font-size: 0.78em;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.v {
    margin: 0;
    font-weight: 600;
    font-size: 0.95em;
    word-break: break-word;
    opacity: 0.75;
}

.link {
    color: var(--color-text-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
    opacity: 0.85;
}

.link:hover {
    opacity: 0.7;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.15rem;
}

.tag {
    padding: 0.2rem 0.55rem;
    border: var(--border-primary);
    border-radius: 999px;
    font-size: 0.85em;
    opacity: 0.85;
}

.timeline-entry {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: var(--border-primary);
}

.timeline-entry:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
}

.timeline-main {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.timeline-title {
    margin: 0;
    font-weight: 700;
    font-size: 0.95em;
}

.timeline-sub {
    margin: 0;
    opacity: 0.6;
    font-size: 0.85em;
}

.timeline-years {
    margin: 0;
    flex-shrink: 0;
    font-size: 0.82em;
    opacity: 0.55;
    white-space: nowrap;
}

.empty {
    grid-column: 1 / -1;
    margin: 0;
    opacity: 0.7;
    font-weight: 600;
}

@media (max-width: 460px) {
    .intro {
        grid-template-columns: minmax(0, 1fr);
        row-gap: 1rem;
    }

    .photo-col {
        justify-self: start;
    }

    .photo-wrap {
        width: min(var(--photo-size), 220px);
        height: min(var(--photo-size), 220px);
    }
}
</style>