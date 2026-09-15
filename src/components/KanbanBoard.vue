<script setup lang="ts">
import type { Task } from '@/types/task';
import { computed, ref } from 'vue';

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (event: 'update-status', payload: { id: string; status: Task['status'] }): void
}>()

const columns: Array<{ key: Task['status']; title: string }> = [
  { key: 'todo', title: '待办' },
  { key: 'in-progress', title: '进行中' },
  { key: 'done', title: '已完成' },
]

const getColumnTasks = (status: Task['status']) =>
  computed(() => props.tasks.filter((task) => task.status === status))

const dragTaskId = ref<string | null>(null)

const onDragStart = (taskId: string) => {
  dragTaskId.value = taskId
}

const onDrop = (status: Task['status']) => {
  if (!dragTaskId.value) return

  emit('update-status', { id: dragTaskId.value, status })
  dragTaskId.value = null
}

const getPriorityClasses = (priority: Task['priority']) => {
  if (priority === 'high') return 'bg-red-100 text-red-700'
  if (priority === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const getStatusBadgeClasses = (status: Task['status']) => {
  if (status === 'todo') return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
  if (status === 'in-progress') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
}

const getStatusLabel = (status: Task['status']) => {
  if (status === 'todo') return '待办'
  if (status === 'in-progress') return '进行中'
  return '已完成'
}

const getDueText = (task: Task) => {
  if (task.status === 'done') return '已完成'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (task.status === 'in-progress') {
    return diffDays <= 0 ? '今天截止' : `还剩 ${diffDays} 天`
  }

  return '等待开始'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <section
      v-for="column in columns"
      :key="column.key"
      class="min-h-[260px] rounded-2xl border border-slate-200 bg-slate-100/70 p-3 dark:border-slate-700 dark:bg-slate-900/70"
      @dragover.prevent
      @drop="onDrop(column.key)"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-700 dark:text-slate-200">{{ column.title }}</h3>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {{ getColumnTasks(column.key).value.length }}
        </span>
      </div>

      <div
        v-if="getColumnTasks(column.key).value.length === 0"
        class="rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
      >
        暂无任务
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="task in getColumnTasks(column.key).value"
          :key="task.id"
          draggable="true"
          class="cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
          @dragstart="onDragStart(task.id)"
        >
          <div class="mb-2 flex items-start justify-between gap-2">
            <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ task.title }}</h4>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-medium" :class="getPriorityClasses(task.priority)">
              {{ task.priority }}
            </span>
          </div>

          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="rounded-full px-2 py-0.5 text-[10px] font-medium" :class="getStatusBadgeClasses(task.status)">
              {{ getStatusLabel(task.status) }}
            </span>
            <span v-if="task.status === 'in-progress'" class="text-[10px] font-medium text-amber-600 dark:text-amber-300">
              {{ getDueText(task) }}
            </span>
          </div>

          <p v-if="task.description" class="text-xs leading-5 text-slate-600 dark:text-slate-300">
            {{ task.description }}
          </p>

          <div class="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            截止: {{ new Date(task.dueDate).toLocaleDateString('zh-CN') }}
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
