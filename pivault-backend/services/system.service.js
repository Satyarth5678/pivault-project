const os = require("os");
const { exec } = require("child_process");

exports.getSystemInfo = () => {
    return new Promise((resolve, reject) => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;

        const ramUsage = `${(usedMem / (1024 ** 3)).toFixed(2)}GB / ${(totalMem / (1024 ** 3)).toFixed(2)}GB`;
        const uptimeHours = (os.uptime() / 3600).toFixed(2);

        // -------- LAN IP Detection --------
        const networkInterfaces = os.networkInterfaces();
        let lanIP = "Not found";

        for (const iface in networkInterfaces) {
            for (const addr of networkInterfaces[iface]) {
                if (addr.family === "IPv4" && !addr.internal) {
                    lanIP = addr.address;
                }
            }
        }

        // 🔥 CPU TEMP FUNCTION (SAFE ADDITION)
        const getCpuTemp = (callback) => {
            if (os.platform() === "linux") {
                exec("cat /sys/class/thermal/thermal_zone0/temp", (err, stdout) => {
                    if (err) return callback("N/A");
                    const temp = (parseInt(stdout) / 1000).toFixed(1);
                    callback(`${temp} °C`);
                });
            } else {
                callback("Not Available");
            }
        };

        // -------- DISK (Development - Windows) --------
        if (process.env.NODE_ENV === "development") {

            exec("wmic logicaldisk get size,freespace,caption", (error, stdout) => {
                if (error) return reject(error);

                const lines = stdout.trim().split("\n").slice(1);
                const disks = [];

                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);

                    if (parts.length === 3) {
                        const [caption, freeSpace, size] = parts;

                        const totalGB = (parseInt(size) / (1024 ** 3)).toFixed(2);
                        const freeGB = (parseInt(freeSpace) / (1024 ** 3)).toFixed(2);
                        const usedGB = (totalGB - freeGB).toFixed(2);

                        disks.push({
                            drive: caption,
                            totalGB,
                            usedGB,
                            freeGB
                        });
                    }
                });

                // 🔥 Inject CPU temp here
                getCpuTemp((cpuTemp) => {
                    return resolve({
                        cpuModel: os.cpus()[0].model,
                        cpuTemp, // 🔥 NEW FIELD
                        ramUsage,
                        uptime: `${uptimeHours} hours`,
                        platform: os.platform(),
                        lanIP,
                        tailscaleIP: "Simulated",
                        disks
                    });
                });
            });

        } else {
            // -------- PRODUCTION MODE (Raspberry Pi - Linux) --------

            exec("df -h --output=source,size,used,avail,target -x tmpfs -x devtmpfs", (error, stdout) => {
                if (error) return reject(error);

                const lines = stdout.trim().split("\n").slice(1);
                const disks = [];

                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);

                    if (parts.length >= 5) {
                        disks.push({
                            drive: parts[0],
                            total: parts[1],
                            used: parts[2],
                            available: parts[3],
                            mount: parts[4]
                        });
                    }
                });

                exec("tailscale ip -4", (err2, stdout2) => {
                    let tailscaleIP = err2 ? "Not connected" : stdout2.trim();

                    // 🔥 Inject CPU temp here
                    getCpuTemp((cpuTemp) => {
                        resolve({
                            cpuModel: os.cpus()[0].model,
                            cpuTemp, // 🔥 NEW FIELD
                            ramUsage,
                            uptime: `${uptimeHours} hours`,
                            platform: os.platform(),
                            lanIP,
                            tailscaleIP,
                            disks
                        });
                    });
                });
            });
        }
    });
};