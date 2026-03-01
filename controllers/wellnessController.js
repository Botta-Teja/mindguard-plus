const Joke = require("../models/Joke");
const Quote = require("../models/Quote");


// ================= RANDOM JOKE =================
const getRandomJoke = async (req, res) => {
    try {
        const count = await Joke.countDocuments();
        if (count === 0) {
            return res.json({ message: "No jokes available" });
        }

        const random = Math.floor(Math.random() * count);
        const joke = await Joke.findOne().skip(random);

        res.json({
            message: "Here is a random joke",
            joke
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching joke",
            error: error.message
        });
    }
};


// ================= RANDOM QUOTE =================
const getRandomQuote = async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        if (count === 0) {
            return res.json({ message: "No quotes available" });
        }

        const random = Math.floor(Math.random() * count);
        const quote = await Quote.findOne().skip(random);

        res.json({
            message: "Here is your motivational quote",
            quote
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching quote",
            error: error.message
        });
    }
};


// ================= BREATHING SESSION =================
const getBreathingSession = async (req, res) => {
    try {
        const inhale = 4;
        const hold = 4;
        const exhale = 6;
        const cycles = 5;

        const totalDuration = (inhale + hold + exhale) * cycles;

        res.json({
            message: "Breathing session ready",
            session: {
                inhale,
                hold,
                exhale,
                cycles,
                totalDuration
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generating session",
            error: error.message
        });
    }
};

module.exports = {
    getRandomJoke,
    getRandomQuote,
    getBreathingSession
};
