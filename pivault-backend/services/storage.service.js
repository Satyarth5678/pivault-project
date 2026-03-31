exports.getStorageHealth = () => {
    return new Promise((resolve) => {
        // Mock data for development
        resolve({
            status: "Healthy",
            temperature: "35°C",
            reallocatedSectors: 0,
            powerOnHours: 870,
            smartSupported: true
        });
    });
};