const { getStorageHealth } = require("../services/storage.service");

exports.getHealthStatus = async (req, res) => {
    try {
        const data = await getStorageHealth();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Storage health error",
            error: error.message
        });
    }
};