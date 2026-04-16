<script setup lang="ts">
import { ref, watch } from 'vue'
import { REFRESH_OPTIONS } from '../constants'
import type { UserSettings } from '../types'

const props = defineProps<{
  open: boolean
  settings: UserSettings
}>()

const emit = defineEmits<{
  close: []
  save: [settings: UserSettings]
}>()

const local = ref<UserSettings>({ ...props.settings })

watch(
  () => props.open,
  (v) => {
    if (v) local.value = { ...props.settings }
  },
)

function handleSave() {
  emit('save', { ...local.value })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl"
        >
          <!-- Title -->
          <h2 class="mb-6 text-lg font-bold text-[var(--color-text-primary)]">
            ⚙️ 看板设置
          </h2>

          <div class="space-y-5">
            <!-- Twelve Data API Key -->
            <div>
              <label
                class="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                Twelve Data API Key
              </label>
              <input
                v-model="local.twelveDataApiKey"
                type="password"
                placeholder="输入 Twelve Data API Key"
                class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <p class="mt-1 text-xs text-[var(--color-text-muted)]">
                免费注册：
                <a
                  href="https://twelvedata.com"
                  target="_blank"
                  class="text-[var(--color-accent)] underline"
                >
                  twelvedata.com
                </a>
                （8 次/分钟，800 次/天）
              </p>
            </div>

            <!-- FRED API Key -->
            <div>
              <label
                class="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                FRED API Key
                <span class="text-xs text-[var(--color-text-muted)]"
                  >（可选，US10Y 备用）</span
                >
              </label>
              <input
                v-model="local.fredApiKey"
                type="password"
                placeholder="输入 FRED API Key"
                class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <p class="mt-1 text-xs text-[var(--color-text-muted)]">
                免费注册：
                <a
                  href="https://fred.stlouisfed.org"
                  target="_blank"
                  class="text-[var(--color-accent)] underline"
                >
                  fred.stlouisfed.org
                </a>
              </p>
            </div>

            <!-- Refresh Interval -->
            <div>
              <label
                class="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                刷新间隔
              </label>
              <select
                v-model.number="local.refreshInterval"
                class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option
                  v-for="opt in REFRESH_OPTIONS"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-primary)]"
              @click="emit('close')"
            >
              取消
            </button>
            <button
              class="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              @click="handleSave"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
