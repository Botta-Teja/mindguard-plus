const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    botReply: {
        type: String
    },
    emotion: {
        type: String
    },
    riskLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW"
    },
    emotionScore: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Chat", chatSchema);
