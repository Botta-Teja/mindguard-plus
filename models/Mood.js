const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,  // Format: YYYY-MM-DD
        required: true
    },
    dominantEmotion: {
        type: String,
        default: "Neutral"
    },
    totalScore: {
        type: Number,
        default: 0
    },
    entryCount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Mood", moodSchema);
