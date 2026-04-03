require("dotenv").config();
const initStorage = require("./utils/initStorage");
const cors = require("cors");
const uploadRoutes = require("./routes/upload.routes");

const app = require("./app");
app.use(cors());

require("./scheduler/backup.scheduler");

const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

// ✅ ADD THIS (CRITICAL FIX)
app.use("/api/files", uploadRoutes);

initStorage();

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});
