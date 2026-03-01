const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema(
{
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "general"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Joke", jokeSchema);
