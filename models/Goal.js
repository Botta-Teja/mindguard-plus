const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    time: {
        type: String, // HH:MM format
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    phone: {
        type: String // for SMS
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);