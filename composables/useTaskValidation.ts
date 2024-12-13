import { ref } from 'vue';
import type { Task } from '~/types/task';

export const useTaskValidation = () => {
  const isValidTitle = ref(true);
  const isValidDueDate = ref(true);
  const isValidDescription = ref(true);

  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      isValidTitle.value = false;
      return false;
    }
    isValidTitle.value = true;
    return true;
  };

  const validateDueDate = (dueDate: Date | undefined): boolean => {
    if (!dueDate) {
      isValidDueDate.value = false;
      return false;
    }
    const today = new Date();
    if (dueDate < today) {
      isValidDueDate.value = false;
      return false;
    }
    isValidDueDate.value = true;
    return true;
  };

  const validateDescription = (description: string): boolean => {
    if (description.length > 500) {
      isValidDescription.value = false;
      return false;
    }
    isValidDescription.value = true;
    return true;
  };

  const validateTask = (task: Task): boolean => {
    return validateTitle(task.title) && validateDueDate(task.dueDate) && validateDescription(task.description || '');
  };

  return {
    isValidTitle,
    isValidDueDate,
    isValidDescription,
    validateTitle,
    validateDueDate,
    validateDescription,
    validateTask
  };
};
