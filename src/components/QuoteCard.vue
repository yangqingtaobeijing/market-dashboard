<script setup lang="ts">
import { computed } from 'vue'
import type { IndicatorData, IndicatorMeta } from '../types'
import { formatValue, formatPercent, formatChange } from '../utils/format'

const props = defineProps<{
  meta: IndicatorMeta
  data: IndicatorData
}>()

const direction = computed(() => {
  if (props.data.changePercent === null) return 'flat'
  if (props.data.changePercent > 0) return 'up'
  if (props.data.changePercent < 0) return 'down'
  return 'flat'
})

const colorClass = computed(() => {
  switch (direction.value) {
    case 'up':
      return 'text-[var(--color-up)]'
    case 'down':
      return 'text-[var(--color-down)]'
    default:
      return 'text-[var(--color-flat)]'
  }
})

const arrow = computed(() => {
  switch (direction.value) {
    case 'up':
      return '▲'
    case 'down':
      return '▼'
    default:
      return ''
  }
})

const displayValue = computed(() =>
  formatValue(props.data.value, props.meta.decimals),
)

const displayChange = computed(() =>
  formatChange(props.data.change, props.meta.decimals),
)

const displayPercent = computed(() => formatPercent(props.data.changePercent))
</script>

<template>
  <div
    class="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all duration-200 hover:bg-[var(--color-bg-card-hover)] hover:shadow-lg"
    :class="{ 'card-loading': data.loading }"
  >
    <!-- Header: name + code -->
    <div class="mb-3 flex items-baseline justify-between">
      <div>
        <span class="text-sm font-medium text-[var(--color-text-secondary)]">
          {{ meta.name }}
        </span>
      </div>
      <span class="text-xs font-mono text-[var(--color-text-muted)]">
        {{ meta.id }}
      </span>
    </div>

    <!-- Price -->
    <div class="mb-2">
      <span
        class="tabular-nums text-3xl font-bold tracking-tight text-[var(--color-text-primary)]"
      >
        {{ displayValue }}
      </span>
      <span
        v-if="meta.unit && data.value !== null"
        class="ml-1 text-sm text-[var(--color-text-muted)]"
      >
        {{ meta.unit }}
      </span>
    </div>

    <!-- Change -->
    <div v-if="data.value !== null" class="flex items-center gap-2">
      <span :class="colorClass" class="tabular-nums text-sm font-semibold">
        {{ arrow }} {{ displayPercent }}
      </span>
      <span
        :class="colorClass"
        class="tabular-nums text-xs"
      >
        {{ displayChange }}
      </span>
    </div>

    <!-- Error state -->
    <div
      v-if="data.error"
      class="mt-2 text-xs text-[var(--color-down)] opacity-80"
    >
      {{ data.error }}
    </div>
  </div>
</template>
