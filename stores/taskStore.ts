import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, TaskFilter } from '~/types/task';
import { hardcodedUser } from './user';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]') as Task[],
    currentFilter: {} as TaskFilter,
    user: hardcodedUser,
    isEditModalOpen: false,
    taskToEdit: null as Task | null,
    isCreateModalOpen: false,
    isEditTaskModalVisible: false,
  }),

  actions: {
    createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {

      const newTask: Task = {
        ...taskData,
        id: uuidv4().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.tasks.push(newTask);

      try {
        this.syncWithLocalStorage();
      } catch (error) {
        console.error('Error syncing with localStorage:', error);
      }

      return newTask;
    },

    syncWithLocalStorage() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } else {
          console.error('localStorage is not available');
        }
      } catch (error) {
        console.error('localStorage saving error:', error);
        console.error('Tasks:', this.tasks);
      }
    },

    updateTask(id: string, updates: Partial<Task>) {
      const taskIndex = this.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        this.syncWithLocalStorage();
      }
    },

    deleteTask(taskId: string) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.syncWithLocalStorage();
    },

    moveTask(taskId: string, newStatus: TaskStatus) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();
        this.syncWithLocalStorage();
      }
    },

    openEditTaskModal(task: Task) {
      this.isEditTaskModalVisible = true;
      this.taskToEdit = task;
    },

    openCreateTaskModal() {
      this.isCreateModalOpen = true;
    },
  },

  getters: {
    filteredTasks(): Task[] {
      return this.tasks.filter(task => {
        const statusMatch = !this.currentFilter.status || task.status === this.currentFilter.status;
        const priorityMatch = !this.currentFilter.priority || task.priority === this.currentFilter.priority;
        const assigneeMatch = !this.currentFilter.assigneeId || task.assignee?.id === this.currentFilter.assigneeId;
        const tagsMatch = !this.currentFilter.tags?.length ||
          task.tags?.some(tag => this.currentFilter.tags?.includes(tag));

        return statusMatch && priorityMatch && assigneeMatch && tagsMatch;
      });
    },

    tasksByStatus() {
      return (status: TaskStatus) => this.filteredTasks.filter(task => task.status === status);
    },

    getTaskById: (state) => {
      return (id: string): Task | null =>
        state.tasks.find(task => task.id === id) || null;
    }
  }
});
