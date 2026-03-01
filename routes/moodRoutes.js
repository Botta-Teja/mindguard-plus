const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    getTodayMood,
    getWeeklyReport
} = require("../controllers/moodController");

// Today mood
router.get("/today", protect, getTodayMood);

// Weekly report
router.get("/weekly", protect, getWeeklyReport);

module.exports = router;
