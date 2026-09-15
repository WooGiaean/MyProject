import type { Task } from '@/types/task'
import { loadTasks, saveTasks } from '@/utils/storage'
import { reactive, watch } from 'vue'

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Learn Vue 3',
    description: 'Study the basics of Vue 3 and its features.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2023-10-30'),
    createdAt: new Date('2023-10-01'),
  },
  {
    id: '2',
    title: 'Build a ToDo App',
    description: 'Create a simple ToDo application using Vue 3.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date('2023-11-15'),
    createdAt: new Date('2023-10-05'),
  },
  {
    id: '3',
    title: 'Deploy the App',
    description: 'Deploy the ToDo app to a hosting service.',
    status: 'done',
    priority: 'low',
    dueDate: new Date('2023-12-01'),
    createdAt: new Date('2023-10-10'),
  },
]

const tasks = reactive<Task[]>(loadTasks())

if (tasks.length === 0) {
  tasks.push(...initialTasks)
}

watch(
  () => tasks,
  (value) => {
    saveTasks([...value])
  },
  { deep: true },
)

const determineTaskStatus = (dueDate: Date | null): Task['status'] => {
  if (!dueDate) {
    return 'todo'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(dueDate)
  targetDate.setHours(0, 0, 0, 0)

  const endOfYear = new Date(today.getFullYear(), 11, 31)

  if (targetDate >= today && targetDate <= endOfYear) {
    return 'in-progress'
  }

  return 'todo'
}

export function addTask(payload: {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: Date | null
}) {
  tasks.unshift({
    id: crypto.randomUUID(),
    title: payload.title,
    description: payload.description,
    status: determineTaskStatus(payload.dueDate),
    priority: payload.priority,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : new Date('2099-12-31'),
    createdAt: new Date(),
  })
}

export function updateTask(taskId: string, updates: Partial<Task>) {
  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  Object.assign(target, updates)
}

export function deleteTask(taskId: string) {
  const index = tasks.findIndex((task) => task.id === taskId)
  if (index >= 0) {
    tasks.splice(index, 1)
  }
}

export const taskStore = {
  tasks,
  addTask,
  updateTask,
  deleteTask,
}
