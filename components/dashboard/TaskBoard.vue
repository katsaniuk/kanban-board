<template>
  <div class="flex flex-row flex-wrap gap-4 h-full">
    <UCard
        v-for="status in Object.values(TaskStatus)"
        :key="status"
        class="flex-1 min-w-0 basis-1/5 flex flex-col"
        :data-status="status"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h3>{{ formatStatus(status) }}</h3>
          <UButton v-if="status === TaskStatus.TODO" @click="openCreateTaskModal(status)">
            <UIcon name="i-heroicons-plus" />
          </UButton>
        </div>
      </template>

      <draggable
          class="flex-1 overflow-auto"
          v-model="tasksByStatus[status]"
          group="tasks"
          :data-status="status"
          itemKey="id"
          @end="onEnd"
      >
        <template #item="{ element }">
          <div :data-draggable-id="element.id">
            <TaskCard :task="element" @edit="openTaskDetails(element)" @delete="deleteTask(element.id)" />
          </div>
        </template>
      </draggable>
    </UCard>

    <UModal v-model="isCreateModalOpen">
      <template #header>
        <h3 class="text-lg font-semibold">Create Task</h3>
      </template>
      <TaskCreateModal
          :status="modalTaskStatus ?? TaskStatus.TODO"
          @close="closeCreateTaskModal"
      />
    </UModal>

    <UModal v-model="isEditModalOpen">
      <template #header>
        <h3 class="text-lg font-semibold">Edit Task</h3>
      </template>
      <TaskEditModal v-if="modalTask" :id="modalTask.id" @close="closeEditTaskModal" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import draggable from 'vuedraggable';
import TaskCreateModal from "~/components/task/TaskCreateModal.vue";
import TaskEditModal from "~/components/task/TaskEditModal.vue";
import TaskCard from '~/components/task/TaskCard.vue';
import type { Task } from '~/types/task';
import { TaskStatus } from '~/types/task';
import { useTaskStore } from '~/stores/taskStore';

const taskStore = useTaskStore();
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const modalTaskStatus = ref<TaskStatus | null>(null);
const modalTask = ref<Task | null>(null);

const formatStatus = (status: TaskStatus) => {
  return status
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

const tasksByStatus = reactive({
  [TaskStatus.TODO]: taskStore.tasksByStatus(TaskStatus.TODO),
  [TaskStatus.IN_PROGRESS]: taskStore.tasksByStatus(TaskStatus.IN_PROGRESS),
  [TaskStatus.REVIEW]: taskStore.tasksByStatus(TaskStatus.REVIEW),
  [TaskStatus.DONE]: taskStore.tasksByStatus(TaskStatus.DONE),
});

watch(() => taskStore.tasks, () => {
  updateTaskStatus();
}, { deep: true });

const openCreateTaskModal = (status: TaskStatus) => {
  modalTaskStatus.value = status;
  isCreateModalOpen.value = true;
};

const closeCreateTaskModal = () => {
  isCreateModalOpen.value = false;
  modalTaskStatus.value = null;
};

const openTaskDetails = (task: Task) => {
  modalTask.value = task;
  isEditModalOpen.value = true;
};

const deleteTask = (taskId: string) => {
  taskStore.deleteTask(taskId);
  updateTaskStatus();
};

const closeEditTaskModal = () => {
  isEditModalOpen.value = false;
  modalTask.value = null;
};

const onEnd = (event: any) => {
  const itemId = event.item.getAttribute('data-draggable-id');
  const newStatus = event.to.getAttribute('data-status');

  if (itemId && newStatus) {
    taskStore.updateTask(itemId, { status: newStatus });
    updateTaskStatus();
  } else {
  }
};

const updateTaskStatus = () => {
  tasksByStatus[TaskStatus.TODO] = taskStore.tasksByStatus(TaskStatus.TODO);
  tasksByStatus[TaskStatus.IN_PROGRESS] = taskStore.tasksByStatus(TaskStatus.IN_PROGRESS);
  tasksByStatus[TaskStatus.REVIEW] = taskStore.tasksByStatus(TaskStatus.REVIEW);
  tasksByStatus[TaskStatus.DONE] = taskStore.tasksByStatus(TaskStatus.DONE);
};

</script>

<style scoped>
body, html {
  height: 100vh;
}
</style>
