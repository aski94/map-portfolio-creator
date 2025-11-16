<template>
  <aside>
    <h1 class="title">Styling</h1>

    <form class="form" @submit.prevent @input="onChange">
      <div class="field">
        <label for="pad">Padding</label>
        <input id="pad" type="range" min="5" max="96" v-model.number="general.pad" />
      </div>

      <div class="field">
        <label for="gap">Margin between templates</label>
        <input id="gap" type="range" min="8" max="48" v-model.number="general.gap" />
      </div>

      <div class="field">
        <label for="font">Font family</label>
        <select id="font" v-model="general.font" @change="onChange">
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
        <input id="tSize" type="range" min="12" max="24" v-model.number="general.tSize" />
      </div>

      <div class="field">
        <label for="hSize">Heading size</label>
        <input id="hSize" type="range" min="20" max="60" v-model.number="general.hSize" />
      </div>

      <div class="field">
        <label for="textColor">Text color</label>
        <input id="textColor" class="color" type="color" v-model="general.text" />
      </div>

      <div class="field">
        <label for="headingColor">Heading color</label>
        <input id="headingColor" class="color" type="color" v-model="general.heading" />
      </div>

      <div class="field">
        <label for="accentColor">Accent color</label>
        <input id="accentColor" class="color" type="color" v-model="general.accent" />
      </div>

      <div class="field">
        <label for="bgColor">Background</label>
        <input id="bgColor" class="color" type="color" v-model="general.bg" />
      </div>
    </form>
  </aside>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{ (e: 'update:general', v: any): void }>()
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

function onChange() {
  emit('update:general', { ...general })
}
</script>

<style scoped lang="scss">
aside {
  display: flex;
  flex-direction: column;
  width: 30%;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-secondary);
  padding: 1em;
  margin: var(--margin-primary);
  box-shadow: var(--box-shadow-primary);
  border: var(--border-primary);
}

.title {
  margin-bottom: 0.5em;
}

.form {
  display: flex;
  flex-direction: column;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  margin-bottom: 0.75em;
}

input[type='number'],
select {
  height: 2.5em;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: var(--border-primary);
  padding: 0 0.75em;
  border-radius: var(--border-radius-primary);
}

.color {
  width: 100%;
  height: 2.5em;
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  appearance: none;
  padding: 0;
  cursor: pointer;
}

.color::-webkit-color-swatch-wrapper {
  padding: 0;
  border-radius: inherit;
}

.color::-webkit-color-swatch {
  border: none;
  border-radius: inherit;
}

.color::-moz-color-swatch {
  border: none;
  border-radius: inherit;
}

input[type='range'] {
  width: 100%;
  height: 0.4em;
  border-radius: 999px;
  background: #e5e7eb;
  cursor: pointer;
}
</style>
