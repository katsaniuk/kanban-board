<template>
  <UForm @submit="onSubmit" class="py-4 px-4">
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
      <UButton type="submit" color="primary" :disabled="isSubmitting" :loading="isSubmitting">Create</UButton>
      <UButton color="gray" variant="ghost" @click="$emit('close')">Cancel</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { object, string, array } from 'yup';
import type { InferType } from 'yup';
import { v4 as uuidv4 } from 'uuid';
import type { Task } from '~/types/task';
import { TaskStatus, TaskPriority } from '~/types/task';
import { useTaskStore } from '~/stores/taskStore';
import { today } from '~/utils/dateFormatter';
import type { FormSubmitEvent } from '#ui/types';
import { hardcodedUser } from '~/stores/user';

const emit = defineEmits(['close']);
const props = defineProps<{ status: TaskStatus }>();

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
  participants: array().of(string()),
  priority: string().required('Priority is required'),
  dueDate: string().optional(),
});

type Schema = InferType<typeof schema>;

const formValues = reactive<Schema>({
  title: '',
  description: '',
  assignee: '',
  participants: [],
  priority: TaskPriority.MEDIUM,
  dueDate: today(),
});

const errors = reactive({
  title: '',
  description: '',
  assignee: '',
  priority: '',
});

const isSubmitting = ref(false);

const validateForm = async () => {
  try {
    await schema.validate({
      ...formValues,
      assignee: formValues.assignee.value || formValues.assignee,
      participants: formValues.participants.map(p => p.value || p),
      priority: formValues.priority.value || formValues.priority,
    }, { abortEarly: false });
    errors.title = '';
    errors.description = '';
    errors.assignee = '';
    errors.priority = '';
    return true;
  } catch (validationErrors) {
    validationErrors.inner.forEach((error) => {
      console.error(error);
      errors[error.path] = error.message;
    });
    return false;
  }
};

async function onSubmit(event: Event) {
  event.preventDefault();

  const isValid = await validateForm();
  if (!isValid) {
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    title: formValues.title,
    description: formValues.description,
    status: props.status,
    priority: formValues.priority.value || formValues.priority,
    assignee: formValues.assignee.value || formValues.assignee,
    participants: formValues.participants.map(p => p.value || p),
    creator: {
      id: taskStore.user?.id || 'unknown',
      name: taskStore.user?.name || 'unknown',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : undefined,
    tags: [],
  };

  try {
    isSubmitting.value = true;
    taskStore.createTask(newTask);
    taskStore.syncWithLocalStorage();
    resetForm();
    emit('close');
  } catch (error) {
    console.error('Error creating task:', error);
  } finally {
    isSubmitting.value = false;
  }
}

const resetForm = () => {
  formValues.title = '';
  formValues.description = '';
  formValues.assignee = '';
  formValues.participants = [];
  formValues.priority = TaskPriority.MEDIUM;
  formValues.dueDate = today();
};
</script>
