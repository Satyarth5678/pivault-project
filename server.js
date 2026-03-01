require("dotenv").config();
const app = require("./app");
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () => {
    console.log(`PiVault backend running on port ${PORT} behind nginx`);
});
