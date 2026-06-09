const Goal = require("../models/Goal");

// ADD GOAL
const addGoal = async (req, res) => {
    try {

        const { title, description, time, date, phone } = req.body;

        const goal = new Goal({
            user: req.user,
            title,
            description,
            time,
            date,
            phone
        });

        await goal.save();

        res.json({ message: "Goal added", goal });

    } catch (error) {
        res.status(500).json({ message: "Error adding goal" });
    }
};

// GET GOALS
const getGoals = async (req, res) => {
    try {

        const goals = await Goal.find({ user: req.user });

        res.json({ goals });

    } catch (error) {
        res.status(500).json({ message: "Error fetching goals" });
    }
};

// COMPLETE GOAL
const completeGoal = async (req, res) => {
    try {

        const goal = await Goal.findById(req.params.id);

        goal.completed = true;

        await goal.save();

        res.json({ message: "Goal completed" });

    } catch (error) {
        res.status(500).json({ message: "Error updating goal" });
    }
};
// DELETE GOAL
const deleteGoal = async (req, res) => {
    try {

        console.log("Delete Request ID:", req.params.id);

        const deletedGoal =
            await Goal.findByIdAndDelete(req.params.id);

        console.log("Deleted Goal:", deletedGoal);

        res.json({
            message: "Goal deleted successfully",
            deletedGoal
        });

    } catch (error) {

        console.error("Delete Error:", error);

        res.status(500).json({
            message: "Error deleting goal",
            error: error.message
        });
    }
};
module.exports = {
    addGoal,
    getGoals,
    completeGoal,
    deleteGoal
};