const express = require("express");
const app = express();

const sequelize = require("./config/database");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/", require("./routes/authRoutes"));

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");
  } catch (err) {
    console.error(`DB connection error: ${err}`);
  }
});
