<template>
  <UForm :state="formValues" @submit="onSubmit" class="py-4 px-4">
    <UFormGroup label="Title" name="title">
      <UInput v-model="formValues.title" :error="errors.title" required />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea v-model="formValues.description" :error="errors.description" required />
    </UFormGroup>

    <UFormGroup label="Assignee" name="assignee">
      <USelectMenu v-model="formValues.assignee" :options="userOptions" :error="errors.assignee" required />
    </UFormGroup>

    <UFormGroup label="Participants" name="participants">
      <USelectMenu v-model="formValues.participants" :options="userOptions" multiple />
    </UFormGroup>

    <UFormGroup label="Priority" name="priority">
      <USelectMenu v-model="formValues.priority" :options="priorityOptions" :error="errors.priority" required />
    </UFormGroup>

    <UFormGroup label="Due Date" name="dueDate">
      <UInput v-model="formValues.dueDate" type="date" />
    </UFormGroup>

    <div class="flex justify-end space-x-2 mt-4">
      <UButton type="submit" color="primary" :disabled="isSubmitting" :loading="isSubmitting">Update</UButton>
      <UButton color="gray" variant="ghost" @click="$emit('close')">Cancel</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { object, string, array } from 'yup';
import type { InferType } from 'yup';
import type { Task, Participant } from '~/types/task';
import { TaskStatus, TaskPriority } from '~/types/task';
import { useTaskStore } from '~/stores/taskStore';
import { today } from '~/utils/dateFormatter';
import { hardcodedUser } from '~/stores/user';

const emit = defineEmits(['close']);
const props = defineProps<{ id: string }>();

const taskStore = useTaskStore();

const priorityOptions = Object.values(TaskPriority).map(priority => ({
  label: priority,
  value: priority,
}));

const userOptions = [{ label: hardcodedUser.name, value: hardcodedUser.name }];

const schema = object({
  title: string().required('Title is required'),
  description: string().required('Description is required'),
  assignee: string().required('Assignee is required'),
  participants: array().of(string()).default([]),
  priority: string().required('Priority is required'),
  dueDate: string().optional(),
});

type Schema = InferType<typeof schema>;

const formValues = reactive<Schema>({
  title: '',
  description: '',
  assignee: '',
  participants: [],
  priority: '',
  dueDate: today(),
});

const errors = reactive({
  title: '',
  description: '',
  assignee: '',
  priority: '',
});

const isSubmitting = ref(false);

// Функція для завантаження даних завдання
const loadTaskData = () => {
  const taskToEdit = taskStore.getTaskById(props.id);

  if (taskToEdit) {
    formValues.title = taskToEdit.title || '';
    formValues.description = taskToEdit.description || '';
    formValues.assignee = taskToEdit.assignee || '';
    formValues.participants = taskToEdit.participants.map((p: Participant) => p.name) || [];
    formValues.priority = taskToEdit.priority || '';
    formValues.dueDate = taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : today();
  }
};

// Викликаємо при монтуванні компонента
onMounted(loadTaskData);

const validateForm = async () => {
  try {
    await schema.validate(formValues, { abortEarly: false });
    // Скидаємо помилки
    errors.title = '';
    errors.description = '';
    errors.assignee = '';
    errors.priority = '';
    return true;
  } catch (validationErrors: unknown) {
    if (validationErrors instanceof yup.ValidationError) {
      validationErrors.inner.forEach((error) => {
        errors[error.path as keyof typeof errors] = error.message;
      });
    }
    return false;
  }
};

async function onSubmit(event: Event) {
  event.preventDefault();

  const isValid = await validateForm();
  if (!isValid) return;

  try {
    isSubmitting.value = true;

    // Отримуємо поточне завдання для збереження оригінальних даних
    const currentTask = taskStore.getTaskById(props.id);
    if (!currentTask) {
      console.error('Task not found');
      return;
    }

    const updatedTask: Task = {
      ...currentTask, // Зберігаємо решту оригінальних даних
      title: formValues.title,
      description: formValues.description,
      priority: formValues.priority as TaskPriority,
      assignee: {
        id: currentTask.assignee?.id || '',
        name: formValues.assignee.name
      },
      participants: formValues.participants.map(name => ({
        id: '',
        name
      })),
      updatedAt: new Date().toISOString(),
      dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : undefined,
    };

    taskStore.updateTask(props.id, updatedTask);
    emit('close');
  } catch (error) {
    console.error('Error updating task:', error);
  } finally {
    isSubmitting.value = false;
  }
}

const resetForm = () => {
  formValues.title = '';
  formValues.description = '';
  formValues.assignee = '';
  formValues.participants = [];
  formValues.priority = '';
  formValues.dueDate = today();
};
</script>
