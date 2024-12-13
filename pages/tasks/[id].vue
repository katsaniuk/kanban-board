<template>
  <div v-if="task" class="p-4">
    <h2 class="text-2xl font-bold mb-4">{{ task.title }}</h2>

    <div class="mb-2">
      <span class="font-semibold">Description:</span> {{ task.description || 'No description' }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Status:</span> {{ formatStatus(task.status) }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Priority:</span> {{ task.priority }}
    </div>

    <div v-if="task.dueDate" class="mb-2">
      <span class="font-semibold">Due Date:</span> {{ formatDate(task.dueDate) }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Created By:</span> {{ task.creator.name }}
    </div>

    <div class="mb-2">
      <span class="font-semibold">Assigned To:</span> <span v-if="task.assignee">{{ task.assignee?.name }}</span><span v-else>Not assigned</span>
    </div>

    <div class="mb-2">
      <span class="font-semibold">Performers:</span>
      <ul>
        <li v-for="performer in task.performers" :key="performer.id">
          {{ performer.name }}
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <UButton color="primary" @click="editTask">
        Edit
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTaskStore } from '~/stores/taskStore';
import type { Task } from '~/types/task';
import { formatDate } from '~/utils/dateFormatter';

const route = useRoute();
const taskStore = useTaskStore();
const task = ref<Task | null>(null);

const formatStatus = (status: string) => {
  return status
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

async function fetchTask() {
  task.value = await taskStore.getTaskById(route.params.id as string);

  if (!task.value) {
    console.error('Task not found');
  }
}

onMounted(fetchTask);

const editTask = () => {
  if (task.value) {
    taskStore.openEditTaskModal(task.value)
  }
}
</script>
