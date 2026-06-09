const Chat = require("../models/Chat");
const Mood = require("../models/Mood");
const User = require("../models/User");
const analyzeEmotion = require("../services/emotionService");
const sendAlertEmail = require("../services/alertService");
const fetch = require("node-fetch");


// ================= SEND CHAT =================
const sendChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        // ================= LOAD LAST CHAT (FAST MEMORY) =================
        const lastChat = await Chat.findOne({ user: req.user })
            .sort({ createdAt: -1 });

        let history = "";

        if (lastChat) {
            history = `User: ${lastChat.message}\nAssistant: ${lastChat.botReply}\n`;
        }


        // ================= CALL LOCAL OLLAMA =================
        const aiResponse = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3.2:3b",
                prompt: `
You are MindGuard+, a supportive mental wellness assistant.
Respond kindly and briefly.

${history}

User: ${message}
Assistant:
`,
                stream: false,
                options: {
                    num_predict: 40,
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        });

        const aiData = await aiResponse.json();

        let botReply = aiData.response || "I'm here to listen.";


        // ================= EMOTION ANALYSIS =================
        const { emotion, riskLevel, emotionScore } = analyzeEmotion(message);


        // ================= SAVE CHAT =================
        const newChat = new Chat({
            user: req.user,
            message,
            botReply,
            emotion,
            riskLevel,
            emotionScore
        });

        await newChat.save();


        // ================= DAILY MOOD UPDATE =================
        const today = new Date().toISOString().split("T")[0];

        let mood = await Mood.findOne({
            user: req.user,
            date: today
        });

        if (!mood) {

            mood = new Mood({
                user: req.user,
                date: today,
                dominantEmotion: emotion,
                totalScore: emotionScore,
                entryCount: 1
            });

        } else {

            mood.totalScore += emotionScore;
            mood.entryCount += 1;

            if (mood.totalScore >= 3)
                mood.dominantEmotion = "Happy";
            else if (mood.totalScore <= -4)
                mood.dominantEmotion = "Extreme Distress";
            else if (mood.totalScore < 0)
                mood.dominantEmotion = "Sad";
            else
                mood.dominantEmotion = "Neutral";
        }

        await mood.save();


        // ================= MOOD STREAK =================
        const userData = await User.findById(req.user);

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

        const yesterday = yesterdayDate.toISOString().split("T")[0];

        if (!userData.lastActiveDate) {
            userData.moodStreak = 1;
        }
        else if (userData.lastActiveDate === yesterday) {
            userData.moodStreak += 1;
        }
        else if (userData.lastActiveDate !== today) {
            userData.moodStreak = 1;
        }

        userData.lastActiveDate = today;

        await userData.save();


        // ================= EMERGENCY ALERT =================
        if (riskLevel === "HIGH") {

            for (let contact of userData.emergencyContacts) {

                await sendAlertEmail(
                    contact.email,
                    userData.name,
                    message
                );
            }
        }


        res.json({
            message: "Chat saved successfully",
            emotion,
            riskLevel,
            botReply,
            moodStreak: userData.moodStreak
        });

    }
    catch (error) {

        console.error("Chat error:", error);

        res.status(500).json({
            message: "Chat error",
            error: error.message
        });
    }
};


// ================= CHAT HISTORY =================
const getChatHistory = async (req, res) => {

    try {

        const chats = await Chat.find({ user: req.user })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            chats
        });

    }
    catch (error) {

        res.status(500).json({
            message: "Error fetching chat history"
        });
    }
};


module.exports = {
    sendChat,
    getChatHistory
};