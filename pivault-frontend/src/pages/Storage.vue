<template>
  <div class="storage-wrap"><!-- Loader -->
<Loader v-if="loading" />

<!-- Toast -->
<Toast ref="toastRef" />

<h1 class="page-title">Storage</h1>

<!-- STORAGE USAGE -->
<div class="card mb-6">
  <div class="card-label">Storage Usage</div>

  <div v-for="u in usage" :key="u.username" class="usage-item">
    <div class="usage-header">
      <span>{{ u.username }}</span>
      <span>
        {{ u.used }} MB / {{ !u.limit ? "∞" : u.limit + " MB" }}
      </span>
    </div>

    <div class="usage-bar">
      <div
        class="usage-fill"
        :style="{
          width:
            !u.limit || isNaN(u.limit) || u.limit === 0
              ? '0%'
              : Math.min((u.used / u.limit) * 100, 100) + '%'
        }"
      ></div>
    </div>
  </div>
</div>

<!-- TOGGLE + UPLOAD -->
<div class="card mb-6 flex flex-wrap items-center gap-3 justify-between">
  <div class="flex gap-2">
    <button @click="loadFiles('user')" class="btn-primary">My Files</button>
    <button @click="loadFiles('shared')" class="btn-secondary">Shared</button>
  </div>

  <input type="file" @change="handleUpload" class="file-input" />
</div>

<!-- BREADCRUMB -->
<div class="breadcrumb">
  <span @click="goToRoot">
    {{ currentType === 'shared' ? 'Shared' : 'My Files' }}
  </span>

  <template v-for="(part, index) in pathParts" :key="index">
    <span> / </span>
    <span @click="goToPath(index)">{{ part }}</span>
  </template>
</div>

<!-- FILE LIST -->
<div v-if="files.length === 0" class="empty-state">
  No files found
</div>

<div v-else class="file-grid">
  <div
    v-for="file in files"
    :key="file.name"
    class="file-card"
  >
    <div class="file-header">
      <span @click="handleClick(file)" class="file-name">
        {{ file.isDirectory ? "📂" : "📄" }} {{ file.name }}
      </span>

      <div class="file-actions">
        <button
          v-if="!file.isDirectory"
          @click.stop="downloadFile(file.name)"
          class="btn-small yellow"
        >
          Download
        </button>

        <button
          v-if="!file.isDirectory && canDelete(file)"
          @click.stop="deleteFile(file.name)"
          class="btn-small red"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="file-meta">
      <span v-if="!file.isDirectory">{{ file.size }} KB</span>
      <span v-if="!file.isDirectory"> | </span>
      <span v-if="file.modified">
        {{ new Date(file.modified).toLocaleString() }}
      </span>
    </div>
  </div>
</div>

  </div>
</template><script setup>
import { ref, computed } from "vue";
import Loader from "../components/UI/Loader.vue";
import Toast from "../components/UI/Toast.vue";

const token = localStorage.getItem("token");
const usage = ref([]);
const files = ref([]);
const loading = ref(false);
const toastRef = ref(null);

const currentType = ref("user");
const currentPath = ref("");
const username = localStorage.getItem("username") || "admin";
const role = localStorage.getItem("role") || "admin";

const pathParts = computed(() => {
  return currentPath.value ? currentPath.value.split("/") : [];
});

// 🔥 ALL LOGIC UNCHANGED

const loadUsage = async () => {
  try {
    const res = await fetch(`/api/files/usage?user=${username}&role=${role}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    usage.value = Array.isArray(data) ? data : [data];

  } catch (err) {
    console.error(err);
    toastRef.value?.showToast("Usage load failed ❌", "error");
  }
};

const loadFiles = async (type, folder = "") => {
  currentType.value = type;
  currentPath.value = folder;

  try {
    loading.value = true;

    const res = await fetch(`/api/files?type=${type}&path=${folder}`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (res.status === 401 || res.status === 403) {
      toastRef.value?.showToast("Session expired ❌", "error");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    files.value = data;

  } catch (err) {
    console.error(err);
    toastRef.value?.showToast("Failed to load files ❌", "error");
  } finally {
    loading.value = false;
  }
};

const handleClick = (file) => {
  if (!file.isDirectory) return;

  if (!file.accessible) {
    toastRef.value?.showToast("Access denied ❌", "error");
    return;
  }

  const newPath = currentPath.value
    ? `${currentPath.value}/${file.name}`
    : file.name;

  loadFiles(currentType.value, newPath);
};

const canDelete = () => {
  if (role === "admin") return true;
  if (!currentPath.value) return false;
  return currentPath.value.split("/")[0] === username;
};

const goToRoot = () => loadFiles(currentType.value, "");

const goToPath = (index) => {
  const newPath = pathParts.value.slice(0, index + 1).join("/");
  loadFiles(currentType.value, newPath);
};

const downloadFile = async (fileName) => {
  try {
    const res = await fetch(`/api/files/download?file=${fileName}&path=${currentPath.value}&type=${currentType.value}`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      toastRef.value?.showToast("Download failed ❌", "error");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);

    toastRef.value?.showToast("Download started 📥", "success");

  } catch (err) {
    console.error(err);
    toastRef.value?.showToast("Download error ❌", "error");
  }
};

const deleteFile = async (fileName) => {
  try {
    loading.value = true;

    await fetch(`/api/files/delete?file=${fileName}&path=${currentPath.value}&type=${currentType.value}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    toastRef.value?.showToast("File deleted 🗑️", "success");

    await loadFiles(currentType.value, currentPath.value);
    await loadUsage();

  } catch (err) {
    console.error(err);
    toastRef.value?.showToast("Delete failed ❌", "error");
  } finally {
    loading.value = false;
  }
};

const handleUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    loading.value = true;

    const res = await fetch(`/api/files/upload?path=${currentPath.value}&type=${currentType.value}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      toastRef.value?.showToast(error.message, "error");
      return;
    }

    toastRef.value?.showToast("Upload successful ✅", "success");

    await loadFiles(currentType.value, currentPath.value);
    await loadUsage();

  } catch (err) {
    console.error(err);
    toastRef.value?.showToast("Upload error ❌", "error");
  } finally {
    loading.value = false;
  }
};

loadFiles("user");
loadUsage();
</script><style scoped>
.storage-wrap {
  padding: 1.5rem;
  color: white;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.2rem;
  backdrop-filter: blur(12px);
}

.card-label {
  font-size: 0.7rem;
  color: #60a5fa;
  margin-bottom: 0.8rem;
}

.usage-bar { background: #1f2937; height: 6px; border-radius: 4px; }
.usage-fill { background: linear-gradient(90deg,#3b82f6,#8b5cf6); height: 6px; }

.btn-primary { background: #3b82f6; padding: 6px 12px; border-radius: 8px; }
.btn-secondary { background: #374151; padding: 6px 12px; border-radius: 8px; }

.file-grid { display: grid; gap: 10px; }
.file-card {
  background: rgba(255,255,255,0.04);
  padding: 10px;
  border-radius: 10px;
}

.btn-small { padding: 4px 8px; border-radius: 6px; }
.yellow { background: #facc15; }
.red { background: #ef4444; }

.file-meta { font-size: 0.75rem; color: gray; }
</style>