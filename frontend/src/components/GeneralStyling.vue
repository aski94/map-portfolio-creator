<template>
  <aside>
    <h1 class="title">Styling</h1>

    <form class="form" @submit.prevent @input="onChange">
      <div class="field">
        <label for="pad">Padding</label>
        <input id="pad" type="range" min="5" max="96" v-model.number="local.pad" />
      </div>

      <div class="field">
        <label for="gap">Margin between templates</label>
        <input id="gap" type="range" min="8" max="48" v-model.number="local.gap" />
      </div>

      <div class="field">
        <label for="font">Font family</label>
        <select id="font" v-model="local.font" @change="onChange">
          <option value="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
            Inter (default)
          </option>

          <option value="'Poppins', system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
            Poppins
          </option>

          <option value="Arial, Helvetica, sans-serif">Arial</option>
          <option value="Helvetica, Arial, sans-serif">Helvetica</option>
          <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
          <option value="Verdana, Geneva, sans-serif">Verdana</option>
          <option value="Tahoma, Verdana, sans-serif">Tahoma</option>
          <option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</option>

          <option value="'Times New Roman', Times, serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Palatino</option>

          <option value="'Courier New', Courier, monospace">Courier New</option>
          <option value="'Lucida Console', Monaco, monospace">Lucida Console</option>
        </select>
      </div>

      <div class="field">
        <label for="tSize">Text size</label>
        <input id="tSize" type="range" min="12" max="24" v-model.number="local.tSize" />
      </div>

      <div class="field">
        <label for="hSize">Heading size</label>
        <input id="hSize" type="range" min="20" max="60" v-model.number="local.hSize" />
      </div>

      <div class="field">
        <label for="textColor">Text color</label>
        <input id="textColor" class="color" type="color" v-model="local.text" />
      </div>

      <div class="field">
        <label for="headingColor">Heading color</label>
        <input id="headingColor" class="color" type="color" v-model="local.heading" />
      </div>

      <div class="field">
        <label for="accentColor">Accent color</label>
        <input id="accentColor" class="color" type="color" v-model="local.accent" />
      </div>

      <div class="field">
        <label for="bgColor">Background</label>
        <input id="bgColor" class="color" type="color" v-model="local.bg" />
      </div>
    </form>
  </aside>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

type General = {
  pad: number
  gap: number
  font: string
  hSize: number
  tSize: number
  text: string
  heading: string
  accent: string
  bg: string
}

const props = defineProps<{
  general: General
}>()

const emit = defineEmits<{
  (e: 'update:general', v: General): void
}>()

const local = reactive<General>({
  pad: props.general.pad,
  gap: props.general.gap,
  font: props.general.font,
  hSize: props.general.hSize,
  tSize: props.general.tSize,
  text: props.general.text,
  heading: props.general.heading,
  accent: props.general.accent,
  bg: props.general.bg,
})

watch(
  () => props.general,
  (g) => {
    Object.assign(local, g)
  },
  { deep: true, immediate: true },
)

function onChange() {
  emit('update:general', { ...local })
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/Panel.scss';
</style>
