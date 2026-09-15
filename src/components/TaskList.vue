<script setup lang="ts">
import type { Task } from '@/types/task';
import { computed, ref } from 'vue';
import TaskCard from './TaskCard.vue';

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (event: 'toggle', id: string): void
  (event: 'delete', id: string): void
}>()

type StatusFilter = 'all' | 'todo' | 'in-progress' | 'done'

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
]

const activeFilter = ref<StatusFilter>('all')

const filteredTasks = computed(() => {
  const sorted = [...props.tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (activeFilter.value === 'all') {
    return sorted
  }

  return sorted.filter((task) => task.status === activeFilter.value)
})

const onToggle = (id: string) => emit('toggle', id)
const onDelete = (id: string) => emit('delete', id)
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="rounded-full border px-3 py-1.5 text-sm transition-colors dark:border-slate-700 dark:text-slate-200"
        :class="
          activeFilter === filter.value
            ? 'border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20 dark:border-blue-400 dark:bg-blue-500'
            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
        "
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="filteredTasks.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
      还没有任务，点击下方按钮创建第一个吧
    </div>

    <div v-else class="space-y-4">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="onToggle"
        @delete="onDelete"
      />
    </div>
  </section>
</template>
