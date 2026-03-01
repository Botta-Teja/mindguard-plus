const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    getRandomJoke,
    getRandomQuote,
    getBreathingSession
} = require("../controllers/wellnessController");

// Random joke
router.get("/joke", protect, getRandomJoke);

// Random quote
router.get("/quote", protect, getRandomQuote);

// Breathing session
router.get("/breathing", protect, getBreathingSession);

module.exports = router;
