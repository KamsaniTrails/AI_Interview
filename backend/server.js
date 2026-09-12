require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const interviewRoutes = require("./routes/interviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const historyRoutes = require("./routes/historyRoutes");


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
connectDB();

const path = require("path");

// Serve static assets from frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);

// Wildcard route to handle SPA client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});