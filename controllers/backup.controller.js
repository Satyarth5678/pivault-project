const {
    runBackup,
    getBackupStatus,
    getBackupHistory
} = require("../services/backup.service");

exports.startBackup = async (req, res) => {
    const result = await runBackup();
    res.status(200).json({
        success: true,
        data: result
    });
};

exports.checkBackupStatus = (req, res) => {
    res.status(200).json({
        success: true,
        data: getBackupStatus()
    });
};

exports.getHistory = (req, res) => {
    res.status(200).json({
        success: true,
        data: getBackupHistory()
    });
};