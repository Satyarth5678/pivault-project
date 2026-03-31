<template>
  <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
    
    <!-- LEFT -->
    <span class="font-bold">PiVault Dashboard</span>

    <!-- RIGHT -->
    <div class="flex items-center gap-4">

      <!-- 👤 USER INFO -->
      <span class="text-sm text-gray-300">
        {{ isLoggedIn ? username + " (" + role + ")" : "Please login" }}
      </span>

      <!-- 🔘 BUTTON -->
      <button
        v-if="isLoggedIn"
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>

      <button
        v-else
        @click="goLogin"
        class="bg-blue-500 px-3 py-1 rounded"
      >
        Login
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const role = ref("");
const isLoggedIn = ref(false);

// 🔄 Load user data
const loadUser = () => {
  username.value = localStorage.getItem("username") || "";
  role.value = localStorage.getItem("role") || "";
  isLoggedIn.value = !!localStorage.getItem("token");
};

// ✅ Initial load
onMounted(loadUser);

// 🔥 Sync on login/logout
window.addEventListener("storage", loadUser);

// 🔓 Logout
const logout = () => {
  localStorage.clear();
  loadUser(); // 🔥 instant UI update
  router.push("/login");
};

// 🔐 Go to login
const goLogin = () => {
  router.push("/login");
};
</script>