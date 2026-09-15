<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', payload: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    dueDate: Date | null
  }): void
}>()

const formatDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = new Date()
const minDate = formatDateInput(today)
const maxDate = formatDateInput(new Date(today.getFullYear(), 11, 31))

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
})

const titleError = ref('')
const dueDateError = ref('')

const close = () => {
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  }
  titleError.value = ''
  dueDateError.value = ''
}

const handleSubmit = () => {
  if (!form.value.title.trim()) {
    titleError.value = '标题不能为空'
    return
  }

  const selectedDate = form.value.dueDate ? new Date(`${form.value.dueDate}T00:00:00`) : null

  if (selectedDate) {
    const minDateValue = new Date(`${minDate}T00:00:00`)
    const maxDateValue = new Date(`${maxDate}T00:00:00`)

    if (selectedDate < minDateValue || selectedDate > maxDateValue) {
      dueDateError.value = '截止日期必须在今天到当前年底之间'
      return
    }
  }

  titleError.value = ''
  dueDateError.value = ''
  emit('submit', {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    priority: form.value.priority,
    dueDate: selectedDate,
  })
  resetForm()
  close()
}

const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).dataset.backdrop === 'true') {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
)

onMounted(() => {
  if (props.modelValue) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
      data-backdrop="true"
      @click="handleBackdropClick"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        @click.stop
      >
        <div class="mb-5 flex items-center justify-between">
          <h2 id="task-modal-title" class="text-xl font-semibold text-slate-800 dark:text-slate-100">新建任务</h2>
          <button
            type="button"
            class="text-xl text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
            @click="close"
          >
            ×
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">标题</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': titleError }"
              placeholder="请输入任务标题"
            />
            <p v-if="titleError" class="mt-1 text-sm text-red-500">{{ titleError }}</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="请输入任务描述（可选）"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">截止日期</label>
            <input
              v-model="form.dueDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': dueDateError }"
            />
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">可选：不填则默认按“待办”处理</p>
            <p v-if="dueDateError" class="mt-1 text-sm text-red-500">{{ dueDateError }}</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">优先级</label>
            <select
              v-model="form.priority"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="close"
            >
              取消
            </button>
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
