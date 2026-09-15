import { beforeEach, describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import TaskCard from '../components/TaskCard.vue'
import { loadTasks, saveTasks } from '../utils/storage'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app tabs and task cards', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Vibe Coding_ToDo')
    expect(wrapper.text()).toContain('列表')
    expect(wrapper.text()).toContain('看板')
    expect(wrapper.findAllComponents(TaskCard)).toHaveLength(3)
  })

  it('ignores malformed storage payloads and normalizes saved tasks', () => {
    localStorage.setItem('vibe-coding-tasks', JSON.stringify({ bad: true }))
    expect(loadTasks()).toEqual([])

    const validTasks = [
      {
        id: 'task-1',
        title: 'Valid task',
        description: 'Description',
        status: 'todo',
        priority: 'high',
        dueDate: '2025-01-01T00:00:00.000Z',
        createdAt: '2025-01-02T00:00:00.000Z',
      },
    ]

    saveTasks(validTasks as any)

    const result = loadTasks()
    expect(result).toHaveLength(1)

    const firstTask = result[0]
    expect(firstTask).toBeDefined()
    if (!firstTask) {
      throw new Error('Expected task to be loaded from storage')
    }

    expect(firstTask).toMatchObject({
      id: 'task-1',
      title: 'Valid task',
      status: 'todo',
      priority: 'high',
    })
    expect(firstTask.dueDate).toBeInstanceOf(Date)
    expect(firstTask.createdAt).toBeInstanceOf(Date)
  })
})
