const os = require("os");
const { execSync } = require("child_process");

exports.getSystemInfo = (req, res) => {
    try {
        const cpus = os.cpus();
        const nets = os.networkInterfaces();

        let lanIP = "N/A";
        let tailscaleIP = "Not available";

        // ✅ LAN IP detection
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === "IPv4" && !net.internal) {
                    if (!net.address.startsWith("169.")) {
                        lanIP = net.address;
                    }
                }
            }
        }

        // ✅ 🔥 TAILSCALE IP (CORRECT METHOD)
        try {
            const tsIP = execSync("tailscale ip -4").toString().trim();
            if (tsIP) {
                tailscaleIP = tsIP;
            }
        } catch (err) {
            console.log("Tailscale CLI not found or not running");
        }

        res.json({
            cpuModel: cpus[0].model,
            ramUsage: `${((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2)} GB / ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
            uptime: `${Math.floor(os.uptime() / 60)} minutes`,
            platform: os.platform(),
            lanIP,
            tailscaleIP,
            cpuTemp: "N/A"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "System info error" });
    }
};