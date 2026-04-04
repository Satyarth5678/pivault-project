<template>
  <div class="flex min-h-screen bg-gray-950 text-white">
    
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <slot />
    </div>

  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>