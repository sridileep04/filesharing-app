//require('dotenv').config();
require("dotenv").config({ path: __dirname + "/.env" });

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const startCleanupJob = require('./cron/cleanup');
// Routes
const Routes = require('./routes/router');

const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//app.get("*", (req, res) => {
//  res.sendFile(path.join(__dirname, "public", "404.html"));
//});


// Rate limit
const apiLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 2,
    message: "Too many requests"
});
app.use('/api/', apiLimiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Mongo Error:", err));

// GridFS initialization
const conn = mongoose.connection;
let gridfsBucket;
conn.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
    app.locals.gfsBucket = gridfsBucket;
});


// Routes
app.use('/api', Routes);

//cron job cleaning
startCleanupJob(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
