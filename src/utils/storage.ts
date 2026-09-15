import type { Task } from '@/types/task'

const STORAGE_KEY = 'vibe-coding-tasks'
const validStatuses = new Set<Task['status']>(['todo', 'in-progress', 'done'])
const validPriorities = new Set<Task['priority']>(['low', 'medium', 'high'])

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

const isTask = (value: unknown): value is Task => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === 'string' &&
    validStatuses.has(candidate.status as Task['status']) &&
    validPriorities.has(candidate.priority as Task['priority']) &&
    toDate(candidate.dueDate) !== null &&
    toDate(candidate.createdAt) !== null
  )
}

const normalizeTask = (value: unknown): Task | null => {
  if (!isTask(value)) {
    return null
  }

  const candidate = value as Task

  return {
    id: candidate.id,
    title: candidate.title.trim(),
    description: candidate.description.trim(),
    status: candidate.status,
    priority: candidate.priority,
    dueDate: toDate(candidate.dueDate) as Date,
    createdAt: toDate(candidate.createdAt) as Date,
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    const sanitizedTasks = tasks
      .map((task) => normalizeTask(task))
      .filter((task): task is Task => Boolean(task))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedTasks))
    return true
  } catch {
    return false
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((item) => normalizeTask(item)).filter((item): item is Task => Boolean(item))
  } catch {
    return []
  }
}
