require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/powersense')
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => {
  console.error("MongoDB Connection Error:", err.message);
  console.log("Trying local MongoDB connection...");
  // Fallback to local MongoDB
  mongoose.connect('mongodb://localhost:27017/powersense')
  .then(() => console.log("Local MongoDB Connected"))
  .catch(localErr => {
    console.error("Local MongoDB Connection Failed:", localErr.message);
    console.log("Please ensure MongoDB is running locally or check MONGO_URI in .env");
  });
});

// Auth Routes
app.use("/routes", require("./routes/auth"));
// ML / forecast (runs new.py for dashboard charts)
app.use("/routes/ml", require("./routes/ml"));

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
