<template>
  <div class="p-6 text-white">

    <div v-if="loading">Loading...</div>

    <div v-else-if="error">Error ❌</div>

    <div v-else>
      <p>CPU: {{ data?.cpuModel || "N/A" }}</p>
      <p>RAM: {{ data?.ramUsage || "N/A" }}</p>
      <p>LAN: {{ data?.lanIP || "N/A" }}</p>
      <p>Tailscale: {{ data?.tailscaleIP || "N/A" }}</p>
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

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/system`, {
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