<template>
  <div class="text-white">
    <h1 class="text-2xl font-bold mb-6">Backup System</h1>

    <!-- 🔘 Start Backup -->
    <button
      @click="startBackup"
      :disabled="role !== 'admin'"
      class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      Start Backup
    </button>

    <!-- 📊 Status -->
    <div class="mt-6 p-4 bg-gray-800 rounded">
      <h2 class="text-lg font-semibold mb-2">Current Status</h2>
      <p>
        Status:
        <span
          :class="status.includes('progress') ? 'text-yellow-400' : 'text-green-400'"
        >
          {{ status }}
        </span>
      </p>
    </div>

    <!-- 🎨 Legend -->
    <div class="mt-6 flex space-x-4 text-sm">
      <span class="bg-blue-500 px-2 py-1 rounded">Manual</span>
      <span class="bg-green-500 px-2 py-1 rounded">Daily</span>
      <span class="bg-purple-500 px-2 py-1 rounded">Weekly</span>
    </div>

    <!-- 📜 History -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-2">Backup History</h2>

      <div v-if="history.length === 0">No backups yet</div>

      <div v-else class="space-y-3">
        <div
          v-for="job in history"
          :key="job.id"
          class="bg-gray-800 p-3 rounded flex justify-between items-center"
        >
          <!-- LEFT -->
          <div>
            <p class="font-bold">Job ID: {{ job.id }}</p>

            <p class="text-sm text-gray-400">
              {{ job.startTime }}
            </p>

            <p class="text-sm text-gray-400">
              Duration: {{ job.durationSeconds }} sec
            </p>
          </div>

          <!-- RIGHT -->
          <div class="flex items-center space-x-3">
            <!-- TYPE BADGE -->
            <span
              class="text-white text-xs px-3 py-1 rounded"
              :class="getBackupColor(job.type)"
            >
              {{ formatType(job.type) }}
            </span>

            <!-- STATUS -->
            <span class="text-sm text-gray-300">
              {{ job.status }}
            </span>

            <!-- RESTORE -->
            <button
              v-if="role === 'admin'"
              @click="restoreBackup(job.name)"
              class="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const status = ref("Idle");
const history = ref([]);
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

// 🎨 Color mapping
const getBackupColor = (type) => {
  switch (type) {
    case "manual":
      return "bg-blue-500";
    case "auto-daily":
      return "bg-green-500";
    case "auto-weekly":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

// 🏷 Label formatting
const formatType = (type) => {
  if (type === "manual") return "Manual";
  if (type === "auto-daily") return "Daily";
  if (type === "auto-weekly") return "Weekly";
  return type || "Unknown";
};

// 🔁 AUTO REFRESH
let interval = null;

onMounted(() => {
  loadStatus();
  loadHistory();

  interval = setInterval(() => {
    loadHistory();
    loadStatus();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
});

// ▶ Start backup
const startBackup = async () => {
  try {
    status.value = "Backup in progress...";

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/backup/run`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    status.value = data.message;

    await loadHistory();

  } catch (err) {
    console.error(err);
    status.value = "Backup failed";
  }
};

// 🔁 Restore
const restoreBackup = async (name) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/backup/restore?backup=${name}&role=${role}`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();
  status.value = data.message;
};

// 📊 Status
const loadStatus = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/backup/status?role=${role}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();

    if (data.running) {
      status.value = "Backup in progress...";
    } else {
      status.value = "Idle / Ready";
    }

  } catch (err) {
    console.error(err);
  }
};

// 📜 History
const loadHistory = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/backup/history?role=${role}`,
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();
  history.value = Array.isArray(data.history) ? data.history : [];
};
</script>