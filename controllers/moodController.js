const Mood = require("../models/Mood");


// ================= TODAY MOOD =================
const getTodayMood = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const mood = await Mood.findOne({
            user: req.user,
            date: today
        });

        if (!mood) {
            return res.json({
                message: "No mood record found for today"
            });
        }

        res.json({
            message: "Today's mood fetched successfully",
            mood
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching mood",
            error: error.message
        });
    }
};


// ================= WEEKLY REPORT =================
const getWeeklyReport = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const moods = await Mood.find({
            user: req.user,
            createdAt: { $gte: sevenDaysAgo }
        });

        let happyDays = 0;
        let sadDays = 0;
        let extremeDays = 0;
        let neutralDays = 0;

        moods.forEach(mood => {
            if (mood.dominantEmotion === "Happy") happyDays++;
            else if (mood.dominantEmotion === "Sad") sadDays++;
            else if (mood.dominantEmotion === "Extreme Distress") extremeDays++;
            else neutralDays++;
        });

        res.json({
            message: "Weekly report generated",
            totalDaysTracked: moods.length,
            happyDays,
            sadDays,
            extremeDays,
            neutralDays
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generating report",
            error: error.message
        });
    }
};
// ================= AI MOOD INSIGHT =================

const getMoodInsight = async (req, res) => {

    try {

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        const moods = await Mood.find({
            user: req.user,
            createdAt: {
                $gte: sevenDaysAgo
            }
        });

        let happy = 0;
        let sad = 0;
        let distress = 0;
        let neutral = 0;

        moods.forEach(mood => {

            if (
                mood.dominantEmotion === "Happy"
            ) happy++;

            else if (
                mood.dominantEmotion === "Sad"
            ) sad++;

            else if (
                mood.dominantEmotion ===
                "Extreme Distress"
            ) distress++;

            else neutral++;
        });

        let insight = "";

        if (
            happy >= sad &&
            happy >= distress
        ) {

            insight =
            "Your emotional trend is positive this week. Continue your healthy habits and maintain consistency.";

        } else if (
            sad > happy
        ) {

            insight =
            "You may be experiencing emotional challenges recently. Consider reaching out to trusted people and focusing on self-care.";

        } else if (
            distress > 0
        ) {

            insight =
            "Signs of emotional distress were detected. Consider taking breaks, practicing breathing exercises, and seeking support if needed.";

        } else {

            insight =
            "Your mood appears stable. Continue maintaining a balanced routine.";
        }

        res.json({

            happy,
            sad,
            distress,
            neutral,
            insight

        });

    } catch (error) {

        res.status(500).json({
            message:
                "Error generating insight"
        });
    }
};
module.exports = {
    getTodayMood,
    getWeeklyReport,
    getMoodInsight
};