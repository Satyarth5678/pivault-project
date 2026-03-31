const cron = require("node-cron");
const backupService = require("../services/backup.service");

// 🔥 DAILY BACKUP
cron.schedule("* * * * *", async () => {
    console.log("Running DAILY backup...");

    try {
        await backupService.runBackup("auto-daily");
        console.log("Daily backup completed");
    } catch (err) {
        console.error("Daily backup failed", err);
    }
});

// 🔥 WEEKLY BACKUP
cron.schedule("0 3 * * 0", async () => {
    console.log("Running WEEKLY backup...");

    try {
        await backupService.runBackup("auto-weekly");
        console.log("Weekly backup completed");
    } catch (err) {
        console.error("Weekly backup failed", err);
    }
});