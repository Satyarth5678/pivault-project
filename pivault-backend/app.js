const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/files.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/storage", require("./routes/storage.routes"));
app.use("/api/system", require("./routes/system.routes"));
app.use("/api/backup", require("./routes/backup.routes"));
app.use("/api/files", fileRoutes);
app.get("/", (req, res) => {
    res.json({ message: "PiVault backend is running" });
});

module.exports = app;