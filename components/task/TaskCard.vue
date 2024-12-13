<template>
  <UCard class="mb-4">
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="task-title">{{ task.title }}</h3>
        <UBadge :class="`status-badge ${task.status.toLowerCase()}`">{{ formatStatus(task.status) }}</UBadge>
      </div>
    </template>

    <template #default>
      <p class="task-description">{{ task.description || 'No description' }}</p>
      <p><strong>Priority:</strong> {{ task.priority }}</p>
      <p><strong>Due Date:</strong> {{ task.dueDate ? formatDate(task.dueDate) : 'No due date' }}</p>
    </template>

    <template #footer>
      <div class="flex gap-2 mt-4">
        <UButton @click="$emit('edit', task)" color="primary">Edit</UButton>
        <UButton @click="$emit('delete', task.id)" color="red">Delete</UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Task } from '~/types/task';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits(['edit', 'delete']);

const formatStatus = (status: string) => {
  return status
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.status-badge.todo {
  background-color: #f0ad4e;
  color: white;
}

.status-badge.in_progress {
  background-color: #5bc0de;
  color: white;
}

.status-badge.review {
  background-color: #f0ad4e;
  color: white;
}

.status-badge.done {
  background-color: #5cb85c;
  color: white;
}
</style>
