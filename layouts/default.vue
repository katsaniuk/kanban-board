<template>
  <div class="layout">
    <UHeader :links="headerLinks" class="bg-primary py-4">
      <span class="text-black">TODO List</span>
    </UHeader>

    <UMain class="main-content">
      <slot />
    </UMain>

    <UFooter class="bg-primary py-4">
      <p class="text-black">&copy; 2024 Task Manager. All rights reserved.</p>
    </UFooter>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      headerLinks: [
        { label: "Home", to: "/" },
        { label: "Tasks", to: "/tasks" },
      ],
    };
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  padding: 1rem;
}

.main-content {
  flex: 1;
  padding: 1rem;
}

.app-footer {
  background-color: #f1f1f1;
  text-align: center;
  padding: 1rem;
}
</style>
