<template>
  <div class="w-64 h-screen bg-black/40 backdrop-blur border-r border-white/10 text-white flex flex-col justify-between">

    <!-- 🔝 TOP -->
    <div class="p-6">

      <!-- LOGO -->
      <h1 class="text-2xl font-semibold tracking-wide mb-8">
        PiVault
      </h1>

      <!-- NAV -->
      <ul class="space-y-2 text-sm">

        <li>
          <router-link
            to="/dashboard"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition"
            :class="isActive('/dashboard')"
          >
            <LayoutDashboard class="w-5 h-5" />
            Dashboard
          </router-link>
        </li>

        <li>
          <router-link
            to="/storage"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition"
            :class="isActive('/storage')"
          >
            <HardDrive class="w-5 h-5" />
            Storage
          </router-link>
        </li>

        <li>
          <router-link
            to="/backup"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition"
            :class="isActive('/backup')"
          >
            <DatabaseBackup class="w-5 h-5" />
            Backup
          </router-link>
        </li>

        <li>
          <router-link
            to="/services"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition"
            :class="isActive('/services')"
          >
            <Settings class="w-5 h-5" />
            Services
          </router-link>
        </li>

      </ul>
    </div>

    <!-- 🔽 FOOTER -->
    <div class="p-6 text-xs text-gray-400">
      PiVault © 2026
    </div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

// 🔥 Lucide Icons
import {
  LayoutDashboard,
  HardDrive,
  DatabaseBackup,
  Settings
} from "lucide-vue-next";

const route = useRoute();

// ✅ Active Route Highlight
const isActive = (path) => {
  return route.path === path
    ? "bg-white/10 text-white"
    : "text-gray-400 hover:bg-white/5 hover:text-white";
};
</script>