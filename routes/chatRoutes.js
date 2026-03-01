const express = require("express");
const router = express.Router();

const { sendChat, getChatHistory } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");

// Send chat
router.post("/", protect, sendChat);

// Get chat history
router.get("/history", protect, getChatHistory);

module.exports = router;
