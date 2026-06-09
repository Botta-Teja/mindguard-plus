const express = require("express");
const router = express.Router();

const {
    addGoal,
    getGoals,
    completeGoal,
    deleteGoal
} = require("../controllers/goalController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, completeGoal);
router.delete("/:id", protect, deleteGoal);

module.exports = router;