<template>
  <!-- 🔓 PUBLIC PAGES (NO SIDEBAR / NAVBAR) -->
  <div v-if="isPublicRoute" class="min-h-screen">
    <router-view />
  </div>

  <!-- 🔐 APP PAGES (WITH SIDEBAR + NAVBAR) -->
  <div v-else class="flex h-screen">

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
import { useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";

const route = useRoute();

// ✅ Define public routes (NO sidebar)
const publicRoutes = ["/", "/login"];

// ✅ Check if current route is public
const isPublicRoute = publicRoutes.includes(route.path);
</script>