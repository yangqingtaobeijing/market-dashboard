<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import { INDICATORS } from './constants'
import type { IndicatorData, IndicatorId, UserSettings } from './types'
import { fetchAllIndicators } from './services/fetcher'
import { loadSettings, saveSettings, applyTheme } from './utils/settings'
import {
  getMarketSession,
  getMarketSessionLabel,
  getETTimeString,
} from './utils/market'
import { formatTime } from './utils/format'
import QuoteCard from './components/QuoteCard.vue'
import SettingsModal from './components/SettingsModal.vue'

// ---- State ----
const settings = ref<UserSettings>(loadSettings())
const settingsOpen = ref(false)

// Market data keyed by indicator ID
const dataMap = reactive<Record<IndicatorId, IndicatorData>>(
  Object.fromEntries(
    INDICATORS.map((m) => [
      m.id,
      {
        id: m.id,
        value: null,
        change: null,
        changePercent: null,
        previousClose: null,
        loading: false,
        error: null,
        lastUpdated: null,
      } satisfies IndicatorData,
    ]),
  ) as Record<IndicatorId, IndicatorData>,
)

const isRefreshing = ref(false)
const lastGlobalUpdate = ref<Date | null>(null)
const marketSession = ref(getMarketSession())
const etTime = ref(getETTimeString())

// ---- Computed ----
const marketLabel = computed(() => getMarketSessionLabel(marketSession.value))
const lastUpdateStr = computed(() => formatTime(lastGlobalUpdate.value))

const hasApiKey = computed(
  () => !!settings.value.twelveDataApiKey || !!settings.value.fredApiKey,
)

// ---- Actions ----
async function refresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true

  // Set all cards to loading
  for (const id of INDICATORS.map((i) => i.id)) {
    dataMap[id].loading = true
  }

  try {
    const results = await fetchAllIndicators(settings.value)
    for (const r of results) {
      dataMap[r.id] = r
    }
    lastGlobalUpdate.value = new Date()
  } finally {
    isRefreshing.value = false
    for (const id of INDICATORS.map((i) => i.id)) {
      dataMap[id].loading = false
    }
  }
}

function handleSaveSettings(newSettings: UserSettings) {
  settings.value = newSettings
  saveSettings(newSettings)
  applyTheme(newSettings.theme)
  // Restart timer and refresh
  startAutoRefresh()
  refresh()
}

function toggleTheme() {
  const next = settings.value.theme === 'dark' ? 'light' : 'dark'
  settings.value = { ...settings.value, theme: next }
  saveSettings(settings.value)
  applyTheme(next)
}

// ---- Auto refresh ----
let refreshTimer: ReturnType<typeof setInterval> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer)
  const interval = settings.value.refreshInterval
  if (interval > 0) {
    refreshTimer = setInterval(refresh, interval * 1000)
  }
}

// ---- Lifecycle ----
onMounted(() => {
  applyTheme(settings.value.theme)
  refresh()
  startAutoRefresh()

  // Update market session & ET clock every second
  clockTimer = setInterval(() => {
    marketSession.value = getMarketSession()
    etTime.value = getETTimeString()
  }, 1000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  if (clockTimer) clearInterval(clockTimer)
})

watch(
  () => settings.value.refreshInterval,
  () => startAutoRefresh(),
)
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <!-- Header -->
    <header
      class="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-md"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3"
      >
        <!-- Left: title + market status -->
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-bold text-[var(--color-text-primary)]">
            📈 美股行情看板
          </h1>
          <span class="text-sm text-[var(--color-text-secondary)]">
            {{ marketLabel }}
          </span>
          <span class="text-xs font-mono text-[var(--color-text-muted)]">
            美东 {{ etTime }}
          </span>
        </div>

        <!-- Right: update time + actions -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-[var(--color-text-muted)]">
            更新 {{ lastUpdateStr }}
          </span>

          <!-- Refresh button -->
          <button
            :disabled="isRefreshing"
            class="rounded-lg border border-[var(--color-border)] p-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-card)] disabled:opacity-50"
            :class="{ 'animate-spin': isRefreshing }"
            :title="isRefreshing ? '刷新中...' : '手动刷新'"
            @click="refresh"
          >
            ↻
          </button>

          <!-- Theme toggle -->
          <button
            class="rounded-lg border border-[var(--color-border)] p-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-card)]"
            title="切换主题"
            @click="toggleTheme"
          >
            {{ settings.theme === 'dark' ? '☀️' : '🌙' }}
          </button>

          <!-- Settings -->
          <button
            class="rounded-lg border border-[var(--color-border)] p-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-card)]"
            title="设置"
            @click="settingsOpen = true"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="mx-auto max-w-7xl px-6 py-6">
      <!-- No API key notice -->
      <div
        v-if="!hasApiKey"
        class="mb-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4 text-sm text-[var(--color-text-secondary)]"
      >
        💡 请点击右上角
        <button
          class="font-medium text-[var(--color-accent)] underline"
          @click="settingsOpen = true"
        >
          ⚙️ 设置
        </button>
        配置 API Key 以获取实时数据。推荐使用
        <a
          href="https://twelvedata.com"
          target="_blank"
          class="font-medium text-[var(--color-accent)] underline"
          >Twelve Data</a
        >（免费）。
      </div>

      <!-- Cards grid -->
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <QuoteCard
          v-for="indicator in INDICATORS"
          :key="indicator.id"
          :meta="indicator"
          :data="dataMap[indicator.id]"
        />
      </div>

      <!-- Footer -->
      <footer
        class="mt-8 border-t border-[var(--color-border)] pt-4 text-center text-xs text-[var(--color-text-muted)]"
      >
        数据来源：Twelve Data · FRED &nbsp;|&nbsp; 数据仅供参考，不构成投资建议
      </footer>
    </main>

    <!-- Settings modal -->
    <SettingsModal
      :open="settingsOpen"
      :settings="settings"
      @close="settingsOpen = false"
      @save="handleSaveSettings"
    />
  </div>
</template>
