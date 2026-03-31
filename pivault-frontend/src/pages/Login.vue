<template>
  <div class="flex items-center justify-center h-screen bg-gray-900 text-white">
    <div class="bg-gray-800 p-6 rounded w-80">
      <h2 class="text-xl mb-4">Login</h2>

      <input v-model="username" placeholder="Username" class="w-full mb-3 p-2 text-black" />
      <input v-model="password" type="password" placeholder="Password" class="w-full mb-3 p-2 text-black" />

      <button @click="login" class="bg-blue-500 w-full p-2">Login</button>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");

const login = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ STORE
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username); // 🔥 FIXED
    localStorage.setItem("role", data.role);

    // 🔄 update navbar
    window.dispatchEvent(new Event("storage"));

    // ✅ ONLY THIS
    router.push("/dashboard");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error");
  }
};
</script>