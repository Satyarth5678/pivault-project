<template>
  <div class="p-6 text-white">

    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error ❌</div>
<div v-else>
  <p>CPU: {{ data?.cpuModel || "N/A" }}</p>
  <p>RAM: {{ data?.ramUsage || "N/A" }}</p>
  <p>LAN: {{ data?.lanIP || "N/A" }}</p>
  <p>Tailscale: {{ data?.tailscaleIP || "N/A" }}</p>
  <p>CPU Temp: {{ data?.cpuTemp || "N/A" }}</p>

  <!-- 🔥 DISK HEALTH -->
  <div class="mt-4 p-3 bg-gray-800 rounded">
    <h3 class="font-bold mb-2">Disk Health</h3>

    <p>Status: {{ data?.diskHealth?.status || "N/A" }}</p>
    <p>Temperature: {{ data?.diskHealth?.temperature || "N/A" }}</p>

    <hr class="my-2 border-gray-600" />

    <p class="text-sm text-gray-400">
      Device: {{ data?.diskHealth?.device || "N/A" }}
    </p>

    <p class="text-sm text-gray-400">
      Serial: {{ data?.diskHealth?.serial || "N/A" }}
    </p>

    <p class="text-sm text-gray-400">
      Power Hours: {{ data?.diskHealth?.powerOnHours || "N/A" }}
    </p>

    <p class="text-sm text-gray-400">
      Reallocated Sectors: {{ data?.diskHealth?.reallocatedSectors || "0" }}
    </p>
  </div>
</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
      loading: true,
      error: false,
    };
  },

  async mounted() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/system`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("API Error");

      const d = await res.json();

      console.log("DASHBOARD DATA:", d); // ✅ DEBUG

      this.data = d;

    } catch (err) {
      console.error("Dashboard error:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
};
</script>
