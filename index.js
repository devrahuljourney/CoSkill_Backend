const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const database = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const skillRoutes = require("./routes/skill");
const rateLimitar = require("./utils/rateLimitar");
const connectionsRoutes = require("./routes/connections");
const personalMeetingRoutes = require("./routes/personalMeeting");

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
    origin: "*",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", rateLimitar, authRoutes);
app.use("/api/v1/skill", skillRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/connection", connectionsRoutes);
app.use("/api/v1/personal-meeting", personalMeetingRoutes);



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
