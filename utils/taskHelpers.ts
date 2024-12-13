import type { Task } from '~/types/task';

/**
 * Сортування задач за терміном виконання (за датою).
 * @param tasks - масив задач
 * @returns відсортований масив задач
 */
export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

/**
 * Фільтрація задач за статусом.
 * @param tasks - масив задач
 * @param status - статус задачі
 * @returns відфільтрований масив задач
 */
export const filterTasksByStatus = (tasks: Task[], status: string): Task[] => {
  return tasks.filter(task => task.status === status);
};

/**
 * Функція для обчислення часу, що залишився до виконання задачі.
 * @param dueDate - дата виконання задачі
 * @returns рядок із залишковим часом
 */
export const calculateTimeRemaining = (dueDate: Date): string => {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 3600 * 24)) / (1000 * 3600));
  const diffMinutes = Math.floor((diffTime % (1000 * 3600)) / (1000 * 60));

  if (diffDays > 0) return `${diffDays} days left`;
  if (diffHours > 0) return `${diffHours} hours left`;
  return `${diffMinutes} minutes left`;
};

/**
 * Отримання відсотка виконання задачі, якщо є підзадачі.
 * @param task - задача з підзадачами
 * @returns відсоток виконання
 */
export const calculateTaskCompletionPercentage = (task: Task): number => {
  if (!task.performers || task.performers.length === 0) return 0;
  const completed = task.performers.filter(performer => performer.taskStatus?.[task.id] === 'completed').length;
  return (completed / task.performers.length) * 100;
};
