<template>
  <div class="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col justify-between">

    <!-- TOP -->
    <div>
      <h1 class="text-xl font-bold mb-6">PiVault</h1>

      <ul class="space-y-4">

        <li>
          <router-link to="/dashboard" class="hover:text-blue-400">
            Dashboard
          </router-link>
        </li>

        <li>
          <router-link to="/storage" class="hover:text-blue-400">
            Storage
          </router-link>
        </li>

        <li>
          <router-link to="/backup" class="hover:text-blue-400">
            Backup
          </router-link>
        </li>

        <li>
          <router-link to="/services" class="hover:text-blue-400">
            Services
          </router-link>
        </li>

      </ul>
    </div>

    <!-- ❌ REMOVED LOGOUT BUTTON HERE -->

  </div>
</template>