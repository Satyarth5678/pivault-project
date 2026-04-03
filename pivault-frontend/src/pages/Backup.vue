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
        <span class="text-green-400">
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
          <div>
            <p class="font-bold">Job ID: {{ job.id }}</p>
            <p class="text-sm text-gray-400">
              {{ job.startTime }}
            </p>
            <p class="text-sm text-gray-400">
              Duration: {{ job.durationSeconds }} sec
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <span
              class="text-white text-xs px-3 py-1 rounded"
              :class="getBackupColor(job.type)"
            >
              {{ formatType(job.type) }}
            </span>

            <span class="text-sm text-gray-300">
              {{ job.status }}
            </span>

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

const getBackupColor = (type) => {
  switch (type) {
    case "manual": return "bg-blue-500";
    case "auto-daily": return "bg-green-500";
    case "auto-weekly": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

const formatType = (type) => {
  if (type === "manual") return "Manual";
  if (type === "auto-daily") return "Daily";
  if (type === "auto-weekly") return "Weekly";
  return type || "Unknown";
};

let interval = null;

onMounted(() => {
  fetchData();
  interval = setInterval(fetchData, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
});

const startBackup = async () => {
  try {
    status.value = "Running...";

    const res = await fetch("/api/backup/start", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (data.success) {
      status.value = "Completed ✅";
    } else {
      status.value = "Failed ❌";
    }

    await fetchData();

  } catch (err) {
    console.error(err);
    status.value = "Failed ❌";
  }
};

const restoreBackup = async (name) => {
  try {
    const res = await fetch("/api/backup/restore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ backup: name })
    });

    const data = await res.json();

    status.value = data.message;

  } catch (err) {
    console.error(err);
    status.value = "Restore failed ❌";
  }
};

const fetchData = async () => {
  try {
    const statusRes = await fetch("/api/backup/status", {
      headers: { Authorization: "Bearer " + token }
    });
    const statusData = await statusRes.json();

    status.value = statusData.status;

    const historyRes = await fetch("/api/backup/history", {
      headers: { Authorization: "Bearer " + token }
    });
    const historyData = await historyRes.json();

    history.value = Array.isArray(historyData) ? historyData : [];

  } catch (err) {
    console.error("Fetch error:", err);
  }
};
</script>
