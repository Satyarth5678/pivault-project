<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl mb-6">Services - User Management</h1><!-- ➕ CREATE USER -->
<div class="mb-4">
  <input
    v-model="newUser.username"
    placeholder="Username"
    class="block mb-2 p-2 text-black"
  />

  <input
    v-model="newUser.password"
    placeholder="Password"
    class="block mb-2 p-2 text-black"
  />

  <!-- STORAGE INPUT -->
  <input
    v-model.number="newUser.storage"
    type="number"
    placeholder="Storage in MB"
    class="block mb-2 p-2 text-black"
  />

  <button @click="createUser" class="bg-green-500 px-3 py-2">
    Create User
  </button>
</div>

<!-- 👥 USER LIST -->
<div>
  <h2 class="text-lg mb-3">Users</h2>

  <div v-if="users.length === 0">No users found</div>

  <div
    v-for="user in users"
    :key="user.username"
    class="bg-gray-800 p-3 mb-3 rounded"
  >
    <div class="flex justify-between items-center">
      <div>
        <p><strong>{{ user.username }}</strong></p>
        <p class="text-sm text-gray-400">Role: {{ user.role }}</p>

        <p class="text-sm text-gray-400">
          Storage: {{ user.usedStorage || 0 }} MB /
         {{ user.storageLimit + ' MB' }}
        </p>
      </div>

      <button
        v-if="role === 'admin' && user.username !== 'admin'"
        @click="deleteUser(user.username)"
        class="bg-red-500 px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>

    <!-- PROGRESS BAR -->
    <div class="w-full bg-gray-600 h-2 mt-3">
      <div
        class="bg-green-500 h-2"
        :style="{
          width:
  user.storageLimit
    ? Math.min((user.usedStorage / user.storageLimit) * 100, 100) + '%'
    : '0%'
        }"
      ></div>
    </div>
  </div>
</div>

  </div>
</template><script setup>
import { ref, onMounted } from "vue";

// =============================
// STATE
// =============================
const users = ref([]);

const newUser = ref({
  username: "",
  password: "",
  storage: 100
});

const role = localStorage.getItem("role");

// =============================
// LOAD USERS
// =============================
const loadUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    users.value = Array.isArray(data) ? data : [];

  } catch (err) {
    console.error(err);
    users.value = [];
  }
};

// =============================
// CREATE USER
// =============================
const createUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users?role=${role}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          username: newUser.value.username,
          password: newUser.value.password,
          storageLimit: Number(newUser.value.storage),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

    newUser.value = {
      username: "",
      password: "",
      storage: 100,
    };

    await loadUsers(); // ✅ no reload needed

  } catch (err) {
    console.error(err);
    alert("Error creating user");
  }
};

// =============================
// DELETE USER
// =============================
const deleteUser = async (username) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
  `${import.meta.env.VITE_API_URL}/api/users?username=${username}&role=admin`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    loadUsers();

  } catch (err) {
    console.error(err);
  }
};

// =============================
// INIT
// =============================
onMounted(() => {
  loadUsers();
});
</script>