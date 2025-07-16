const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const database = require("./config/database");
const userRoutes = require("./routes/user");
const skillRoutes = require("./routes/skill");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://192.168.2.13:8081",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/skill", skillRoutes);


// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at ${PORT}`);
});
