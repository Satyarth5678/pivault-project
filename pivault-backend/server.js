require("dotenv").config();
const initStorage = require("./utils/initStorage");
const cors = require("cors");
const app = require("./app");
app.use(cors());
require("./scheduler/backup.scheduler");

const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);
initStorage();
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});