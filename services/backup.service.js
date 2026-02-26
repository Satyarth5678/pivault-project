let backupState = {
    running: false,
    currentJob: null
};

let backupHistory = [];

exports.runBackup = () => {
    return new Promise((resolve) => {
        if (backupState.running) {
            return resolve({ message: "Backup already running" });
        }

        const jobId = Date.now();

        backupState.running = true;
        backupState.currentJob = {
            id: jobId,
            startTime: new Date().toISOString(),
            status: "In Progress"
        };

        // Simulate backup time (10 seconds)
        setTimeout(() => {
            backupState.running = false;

            const endTime = new Date().toISOString();

            const completedJob = {
                ...backupState.currentJob,
                endTime,
                status: "Completed",
                durationSeconds: 10
            };

            backupHistory.push(completedJob);

            backupState.currentJob = null;
        }, 10000);

        resolve({ message: "Backup started", jobId });
    });
};

exports.getBackupStatus = () => {
    return backupState;
};

exports.getBackupHistory = () => {
    return backupHistory;
};