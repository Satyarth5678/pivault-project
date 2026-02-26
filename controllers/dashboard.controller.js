const { getSystemInfo } = require("../services/system.service");

exports.getSystemStatus = async (req, res) => {
    try {
        const data = await getSystemInfo();
        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "System info error",
            error: err.message
        });
    }
};