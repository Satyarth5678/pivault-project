const os = require("os"); const { execSync } = require("child_process");

exports.getSystemInfo = (req, res) => { try { const cpus = os.cpus(); const nets = os.networkInterfaces();

let lanIP = "Not Found";
    let tailscaleIP = "Not Found";
    let cpuTemp = "Not Available";

    // =============================
    // ✅ LAN IP (STRICT FILTER)
    // =============================
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (
                net.family === "IPv4" &&
                !net.internal &&
                (name === "eth0" || name === "wlan0")
            ) {
                lanIP = net.address;
            }
        }
    }

    // =============================
    // ✅ TAILSCALE IP
    // =============================
    try {
        const tsIP = execSync("tailscale ip -4").toString().trim();
        if (tsIP) {
            tailscaleIP = tsIP;
        }
    } catch (err) {
        console.log("Tailscale not running");
    }

    // =============================
    // ✅ CPU TEMPERATURE
    // =============================
    try {
        const tempRaw = execSync("vcgencmd measure_temp", { shell: "/bin/bash" }).toString();
        const match = tempRaw.match(/temp=([\d.]+)'C/);

        if (match && match[1]) {
            cpuTemp = `${match[1]} °C`;
        } else {
            cpuTemp = "Parse Error";
        }
    } catch (err) {
        console.log("CPU TEMP ERROR:", err.message);
        cpuTemp = "Not Available";
    }

    // =============================
    // 🔥 SMART DISK HEALTH (ADVANCED)
    // =============================
    let diskHealth = {
        status: "Unknown",
        temperature: "N/A",
        device: "N/A",
        serial: "N/A",
        powerOnHours: "N/A",
        reallocatedSectors: "N/A",
        info: "SMART Monitoring"
    };

    try {
        const output = execSync("sudo smartctl -a /dev/sda").toString();

        // ✅ HEALTH STATUS
        if (output.includes("PASSED")) {
            diskHealth.status = "Healthy";
        } else if (output.includes("FAILED")) {
            diskHealth.status = "Critical";
        } else {
            diskHealth.status = "Warning";
        }

        // ✅ DEVICE MODEL
        const modelMatch = output.match(/Device Model:\s+(.*)/);
        if (modelMatch) diskHealth.device = modelMatch[1];

        // ✅ SERIAL NUMBER
        const serialMatch = output.match(/Serial Number:\s+(.*)/);
        if (serialMatch) diskHealth.serial = serialMatch[1];

        // ✅ TEMPERATURE
        const tempMatch = output.match(/Temperature_Celsius.*\s(\d+)$/m);
        if (tempMatch) diskHealth.temperature = tempMatch[1] + "°C";

        // ✅ POWER ON HOURS
        const powerMatch = output.match(/Power_On_Hours.*\s(\d+)$/m);
        if (powerMatch) diskHealth.powerOnHours = powerMatch[1];

        // ✅ REALLOCATED SECTORS
        const reallocMatch = output.match(/Reallocated_Sector_Ct.*\s(\d+)$/m);
        if (reallocMatch) diskHealth.reallocatedSectors = reallocMatch[1];

    } catch (err) {
        console.log("SMART ERROR:", err.message);
    }

    // =============================
    // 📤 RESPONSE
    // =============================
    res.json({
        cpuModel: cpus[0].model,
        ramUsage: `${((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2)} GB / ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
        uptime: `${Math.floor(os.uptime() / 60)} minutes`,
        platform: os.platform(),
        lanIP,
        tailscaleIP,
        cpuTemp,
        diskHealth
    });

} catch (err) {
    console.error("System Info Error:", err);
    res.status(500).json({ message: "Error fetching system info" });
}

};
