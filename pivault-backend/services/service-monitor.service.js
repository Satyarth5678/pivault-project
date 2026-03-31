const { exec } = require("child_process");

exports.getServiceStatus = () => {
    return new Promise((resolve) => {

        if (process.env.NODE_ENV === "development") {
            // Simulated data for Windows / development
            return resolve([
                { name: "Samba", status: "Simulated Running", port: 445 },
                { name: "Tailscale", status: "Simulated Connected" },
                { name: "Nginx", status: "Simulated Running", port: 80 }
            ]);
        }

        // PRODUCTION MODE (Raspberry Pi - Linux)
        const services = [];

        exec("systemctl is-active smbd", (err, stdout) => {
            services.push({
                name: "Samba",
                status: stdout.trim() === "active" ? "Running" : "Stopped"
            });

            exec("systemctl is-active nginx", (err2, stdout2) => {
                services.push({
                    name: "Nginx",
                    status: stdout2.trim() === "active" ? "Running" : "Stopped"
                });

                exec("tailscale status", (err3, stdout3) => {
                    services.push({
                        name: "Tailscale",
                        status: err3 ? "Disconnected" : "Connected"
                    });

                    resolve(services);
                });
            });
        });
    });
};