<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-blue-800/60 bg-blue-900 px-6 py-4 text-white shadow-sm shadow-blue-900/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/30">
      <div class="mx-auto flex max-w-5xl items-center justify-between">
        <h1 class="text-2xl font-bold tracking-tight">Vibe Coding_ToDo</h1>
        <ThemeToggle />
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-5 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 rounded-full bg-slate-200 p-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeView === 'list' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'"
            @click="activeView = 'list'"
          >
            列表
          </button>
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="activeView === 'kanban' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'"
            @click="activeView = 'kanban'"
          >
            看板
          </button>
        </div>

        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
          @click="isModalOpen = true"
        >
          + 新建任务
        </button>
      </div>

      <TaskList v-if="activeView === 'list'" :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" />
      <KanbanBoard v-else :tasks="tasks" @update-status="handleStatusUpdate" />
    </main>

    <TaskModal v-model="isModalOpen" @submit="addTask" />
  </div>
</template>

<script setup lang="ts">
import KanbanBoard from '@/components/KanbanBoard.vue'
import TaskList from '@/components/TaskList.vue'
import TaskModal from '@/components/TaskModal.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { ref } from 'vue'
import { taskStore } from './stores/taskStore'
import type { Task } from './types/task'

const tasks = taskStore.tasks
const isModalOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')

const addTask = (payload: {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: Date | null
}) => {
  taskStore.addTask(payload)
}

const toggleTask = (id: string) => {
  const target = tasks.find((task) => task.id === id)
  if (!target) return

  taskStore.updateTask(id, {
    status: target.status === 'done' ? 'todo' : 'done',
  })
}

const deleteTask = (id: string) => {
  taskStore.deleteTask(id)
}

const handleStatusUpdate = ({ id, status }: { id: string; status: Task['status'] }) => {
  taskStore.updateTask(id, { status })
}
</script>
