<template>
  <div class="flex h-screen">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col">

      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <div class="flex-1 p-4 bg-gray-900 text-white overflow-auto">
        <router-view />
      </div>

    </div>

  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
</script>