<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl mb-4">Storage</h1>

    <!-- 📊 STORAGE USAGE -->
    <div class="mb-6">
      <h2 class="text-lg mb-2">Storage Usage</h2>

      <div v-for="u in usage" :key="u.username" class="mb-3">
        <div class="flex justify-between text-sm">
          <span>{{ u.username }}</span>
          <span>
           {{ u.used }} MB / {{ !u.limit ? "∞" : u.limit + " MB" }}
          </span>
        </div>

        <div class="w-full bg-gray-700 h-2 mt-1">
          <div
            class="bg-blue-500 h-2"
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
    

    <!-- 🔘 Toggle -->
    <div class="mb-4">
      <button @click="loadFiles('user')" class="mr-2 bg-blue-500 px-3 py-1">
        My Files
      </button>
      <button @click="loadFiles('shared')" class="bg-green-500 px-3 py-1">
        Shared
      </button>
    </div>

    <!-- ⬆️ UPLOAD -->
    <div class="mb-4">
      <input type="file" @change="handleUpload" class="text-white" />
    </div>

    <!-- 🧭 BREADCRUMB -->
    <div class="mb-4 text-sm text-gray-300">
      <span class="cursor-pointer text-blue-400" @click="goToRoot">
        {{ currentType === 'shared' ? 'Shared' : 'My Files' }}
      </span>

      <template v-for="(part, index) in pathParts" :key="index">
        <span> / </span>
        <span class="cursor-pointer text-blue-400" @click="goToPath(index)">
          {{ part }}
        </span>
      </template>
    </div>

    <!-- 📂 Files -->
    <div v-if="files.length === 0">No files found</div>

    <div
      v-for="file in files"
      :key="file.name"
      class="bg-gray-800 p-3 mb-2 rounded"
    >
      <div class="flex justify-between items-center">
        <span @click="handleClick(file)" class="cursor-pointer">
          {{ file.isDirectory ? "📂" : "📄" }} {{ file.name }}
        </span>

        <div class="space-x-2">
          <button
            v-if="!file.isDirectory"
            @click.stop="downloadFile(file.name)"
            class="bg-yellow-500 px-2"
          >
            Download
          </button>

          <button
            v-if="!file.isDirectory && canDelete(file)"
            @click.stop="deleteFile(file.name)"
            class="bg-red-500 px-2"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- ✅ FILE METADATA -->
      <div class="text-xs text-gray-400 mt-1">
        <span v-if="!file.isDirectory">{{ file.size }} KB</span>
        <span v-if="!file.isDirectory"> | </span>
        <span v-if="file.modified">
          {{ new Date(file.modified).toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// =============================
// 📦 STATE
// =============================
const token = localStorage.getItem("token");
const usage = ref([]);
const files = ref([]);
const currentType = ref("user");
const currentPath = ref("");

// 👤 USER DATA
const username = localStorage.getItem("username") || "admin";
const role = localStorage.getItem("role") || "admin";

// =============================
// 📊 STORAGE USAGE
// =============================
const loadUsage = async () => {
  try {
    const res = await fetch(
      `/api/files/usage?user=${username}&role=${role}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();
    usage.value = Array.isArray(data) ? data : [data];

  } catch (err) {
    console.error(err);
  }
};

// =============================
// 🧭 Breadcrumb
// =============================
const pathParts = computed(() => {
  return currentPath.value ? currentPath.value.split("/") : [];
});

// =============================
// 📂 LOAD FILES
// =============================
const loadFiles = async (type, folder = "") => {
  currentType.value = type;
  currentPath.value = folder;

  try {
    const res = await fetch(
      `/api/files?type=${type}&path=${folder}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      alert("🔒 Please login to access storage");

      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    files.value = data;

  } catch (err) {
    console.error(err);
  }
};

// =============================
// 📂 CLICK HANDLER
// =============================
const handleClick = (file) => {
  if (!file.isDirectory) return;

  if (!file.accessible) {
    alert("🚫 Access Denied");
    return;
  }

  const newPath = currentPath.value
    ? `${currentPath.value}/${file.name}`
    : file.name;

  loadFiles(currentType.value, newPath);
};

// =============================
// ❌ DELETE PERMISSION
// =============================
const canDelete = () => {
  if (role === "admin") return true;

  if (!currentPath.value) return false;

  return currentPath.value.split("/")[0] === username;
};

// =============================
// 🧭 NAVIGATION
// =============================
const goToRoot = () => loadFiles(currentType.value, "");

const goToPath = (index) => {
  const newPath = pathParts.value.slice(0, index + 1).join("/");
  loadFiles(currentType.value, newPath);
};

// =============================
// ⬇ DOWNLOAD
// =============================
const downloadFile = async (fileName) => {
  try {
    const res = await fetch(
      `/api/files/download?file=${fileName}&path=${currentPath.value}&type=${currentType.value}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!res.ok) {
      alert("Download failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
  }
};

// =============================
// ❌ DELETE
// =============================
const deleteFile = async (fileName) => {
  await fetch(
    `/api/files/delete?file=${fileName}&path=${currentPath.value}&type=${currentType.value}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

 await loadFiles(currentType.value, currentPath.value);
await loadUsage(); // 🔥 update bar
};

// =============================
// ⬆️ UPLOAD
// =============================
const handleUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(
      `/api/files/upload?path=${currentPath.value}&type=${currentType.value}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }
    );

    if (!res.ok) {
  const error = await res.json();
  alert(error.message);
  return;
}

const data = await res.json();
alert(data.message);

alert("✅ Upload successful");
    await loadFiles(currentType.value, currentPath.value);
await loadUsage(); // 🔥 THIS FIXES BAR

  } catch (err) {
    console.error(err);
    alert("Upload error");
  }
};

// =============================
// 🚀 INIT
// =============================
loadFiles("user");
loadUsage();
</script>
