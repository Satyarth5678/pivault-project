<template>
  <div class="dashboard-wrap"><div v-if="loading" class="status-msg">
  <span class="status-dot"></span> Loading system data...
</div>

<div v-else-if="error" class="status-msg status-error">
  Error ❌
</div>

<div v-else class="dashboard-grid">

  <!-- ── SYSTEM STATS ── -->
  <div class="card">
    <div class="card-label">System</div>

    <div class="stat-row">
      <span class="stat-key">CPU</span>
      <span class="stat-val">{{ data?.cpuModel || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key">RAM</span>
      <span class="stat-val">{{ data?.ramUsage || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key">LAN</span>
      <span class="stat-val mono">{{ data?.lanIP || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key">Tailscale</span>
      <span class="stat-val mono">{{ data?.tailscaleIP || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key">CPU Temp</span>
      <span class="stat-val">{{ data?.cpuTemp || "N/A" }}</span>
    </div>
  </div>

  <!-- ── DISK HEALTH ── -->
  <div class="card">
    <div class="card-label">Disk Health</div>

    <div class="stat-row">
      <span class="stat-key">Status</span>
      <span class="stat-val">{{ data?.diskHealth?.status || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key">Temperature</span>
      <span class="stat-val">{{ data?.diskHealth?.temperature || "N/A" }}</span>
    </div>

    <div class="card-divider"></div>

    <div class="stat-row">
      <span class="stat-key muted">Device</span>
      <span class="stat-val mono muted">{{ data?.diskHealth?.device || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key muted">Serial</span>
      <span class="stat-val mono muted">{{ data?.diskHealth?.serial || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key muted">Power Hours</span>
      <span class="stat-val muted">{{ data?.diskHealth?.powerOnHours || "N/A" }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-key muted">Reallocated</span>
      <span class="stat-val muted">{{ data?.diskHealth?.reallocatedSectors || "0" }}</span>
    </div>
  </div>

</div>

  </div>
</template><script>
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

      console.log("DASHBOARD DATA:", d);

      this.data = d;

    } catch (err) {
      console.error("Dashboard error:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
};
</script><style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.dashboard-wrap {
  padding: 1.5rem;
  font-family: 'Outfit', sans-serif;
  color: #fff;
}

.status-msg {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255,255,255,0.5);
  padding: 2rem 0;
}
.status-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 8px #3b82f6;
}
.status-error { color: rgba(248,113,113,0.8); }

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}
.card:hover {
  border-color: rgba(59,130,246,0.4);
  box-shadow: 0 10px 40px rgba(59,130,246,0.15);
}

.card-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  margin-bottom: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.stat-row:last-child { border-bottom: none; }

.stat-key {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.5);
}

.stat-val {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
}

.mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
.muted { color: rgba(255,255,255,0.35) !important; }

.card-divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 0.8rem 0;
}
</style>