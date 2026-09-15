<script setup lang="ts">
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)

  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch {
    // Ignore storage quota or private-browser restrictions.
  }
}

const toggleTheme = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY)

    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme === 'dark')
      return
    }
  } catch {
    // Ignore storage access issues and fall back to system preference.
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  applyTheme(prefersDark)
})
</script>

<template>
  <button
    type="button"
    aria-label="切换深色模式"
    class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white transition shadow-sm hover:bg-white/20 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700"
    @click="toggleTheme"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>
