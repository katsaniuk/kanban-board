import { ref } from 'vue';
import { useTaskStore } from '~/stores/taskStore';
import type { Task } from '~/types/task';

export function useTasks() {
  const taskStore = useTaskStore();
  const selectedTask = ref<Task | null>(null);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return taskStore.createTask(taskData);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    taskStore.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
    taskStore.deleteTask(id);
  };

  const selectTaskForEdit = (task: Task) => {
    selectedTask.value = task;
    taskStore.openEditTaskModal(task);
  };

  const resetSelectedTask = () => {
    selectedTask.value = null;
    taskStore.closeEditTaskModal();
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    selectedTask,
    selectTaskForEdit,
    resetSelectedTask
  };
}
