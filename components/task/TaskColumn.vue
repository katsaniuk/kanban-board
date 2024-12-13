<template>
  <div class="task-column" :class="status">
    <h3 class="text-xl font-bold mb-4">{{ statusName }}</h3>

    <div v-if="tasks.length > 0">
      <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @edit="editTask(task)"
          @move="moveTask(task)"
      />
    </div>

    <div v-else>
      <p>No tasks in this column</p>
    </div>

    <UButton
        color="primary"
        @click="openCreateTaskModal"
    >
      Add Task
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '~/stores/taskStore';
import { TaskStatus } from '~/types/task';
import TaskCard from '~/components/task/TaskCard.vue';
import type { Task } from '~/types/task';

const props = defineProps({
  status: {
    type: String as PropType<TaskStatus>,
    required: true,
  },
});

const taskStore = useTaskStore();

const tasks = computed(() => taskStore.tasksByStatus(props.status));

const statusName = computed(() => {
  return props.status
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
});

const openCreateTaskModal = () => {
  taskStore.openCreateTaskModal();
};

const editTask = (task: Task) => {
  taskStore.openEditTaskModal(task);
};

const moveTask = (task: Task) => {
  taskStore.moveTask(task.id, task.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS : TaskStatus.DONE);
};
</script>


<style scoped>
.task-column {
  width: 250px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-column h3 {
  margin-bottom: 20px;
}

.task-column .task-card {
  margin-bottom: 15px;
}
</style>
