<template>
  <div class="flex items-center justify-center h-screen bg-gray-900 text-white">

    <!-- Loader -->
    <Loader v-if="loading" />

    <!-- Toast -->
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />

    <div class="bg-gray-800 p-6 rounded w-80">
      <h2 class="text-xl mb-4">Login</h2>

      <input
        v-model="username"
        placeholder="Username"
        class="w-full mb-3 p-2 text-black"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-3 p-2 text-black"
      />

      <button
        @click="login"
        class="bg-blue-500 w-full p-2 rounded hover:bg-blue-600 transition"
      >
        Login
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "../components/UI/Loader.vue";
import Toast from "../components/UI/Toast.vue";

const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);

const toast = ref({
  show: false,
  message: "",
  type: "success",
});

const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
};

const login = async () => {
  try {
    loading.value = true;

    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim(),
      }),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      showToast("Server error (invalid response)", "error");
      loading.value = false;
      return;
    }

    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      loading.value = false;
      return;
    }

    // ✅ SAVE TOKEN
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    showToast("Login successful ✅");

    // ✅ CORRECT NAVIGATION (FIXED)
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    showToast("Something went wrong", "error");
  } finally {
    loading.value = false;
  }
};
</script>