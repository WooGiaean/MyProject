<script setup lang="ts">
import type { Task } from '@/types/task';
import { computed } from 'vue';

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (event: 'toggle', id: string): void
  (event: 'delete', id: string): void
}>()

const priorityClasses: Record<Task['priority'], string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-500',
}

const isCompleted = computed(() => props.task.status === 'done')
const isInProgress = computed(() => props.task.status === 'in-progress')
const hasDueDate = computed(() => {
  const dueDate = props.task.dueDate
  return dueDate instanceof Date && !Number.isNaN(dueDate.getTime()) && dueDate.getFullYear() !== 2099
})

const formatDate = (date: Date) => new Date(date).toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const statusMeta = computed(() => {
  if (props.task.status === 'done') {
    return { label: '已完成', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
  }

  if (props.task.status === 'in-progress') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(props.task.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return {
      label: diffDays <= 0 ? '进行中' : '进行中',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      dueText: diffDays <= 0 ? '今天截止' : `还剩 ${diffDays} 天`,
    }
  }

  return { label: '待办', className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200', dueText: '等待开始' }
})

const toggleTask = () => {
  emit('toggle', props.task.id)
}

const deleteTask = () => {
  emit('delete', props.task.id)
}
</script>

<template>
  <article
    class="relative flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 transition-transform duration-200 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30"
    :class="priorityClasses[task.priority]"
    :style="{ borderLeftWidth: '4px' }"
  >
    <label class="mt-1 flex cursor-pointer items-center">
      <input
        type="checkbox"
        :checked="isCompleted"
        @change="toggleTask"
        class="h-4 w-4 accent-emerald-500"
      />
    </label>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <h3
            class="truncate text-lg font-semibold text-slate-800 dark:text-slate-100"
            :class="{ 'line-through text-slate-400 dark:text-slate-500': isCompleted }"
          >
            {{ task.title }}
          </h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ task.description }}</p>
        </div>

        <button
          type="button"
          aria-label="删除任务"
          class="ml-2 text-xl leading-none text-slate-400 transition-colors hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
          @click="deleteTask"
        >
          ×
        </button>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          class="rounded-full px-2 py-1 font-medium"
          :class="{
            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low',
          }"
        >
          {{ task.priority }}
        </span>

        <span
          class="rounded-full px-2 py-1 font-medium"
          :class="statusMeta.className"
        >
          {{ statusMeta.label }}
        </span>

        <span v-if="hasDueDate" class="text-slate-500 dark:text-slate-400">截止日期: {{ formatDate(task.dueDate) }}</span>
        <span v-if="isInProgress && hasDueDate" class="text-amber-600 dark:text-amber-300">{{ statusMeta.dueText }}</span>
      </div>
    </div>
  </article>
</template>
