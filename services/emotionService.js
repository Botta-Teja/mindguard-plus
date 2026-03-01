const analyzeEmotion = (text) => {

    const message = text.toLowerCase();

    let emotion = "Neutral";
    let riskLevel = "LOW";
    let emotionScore = 0;

    // 🚨 High Risk Keywords
    if (
        message.includes("suicide") ||
        message.includes("kill myself") ||
        message.includes("end my life") ||
        message.includes("i feel unsafe")
    ) {
        emotion = "Extreme Distress";
        riskLevel = "HIGH";
        emotionScore = -5;
        return { emotion, riskLevel, emotionScore };
    }

    // 😢 Sadness
    if (
        message.includes("sad") ||
        message.includes("depressed") ||
        message.includes("lonely") ||
        message.includes("crying")
    ) {
        emotion = "Sad";
        riskLevel = "MEDIUM";
        emotionScore = -2;
        return { emotion, riskLevel, emotionScore };
    }

    // 😊 Happy
    if (
        message.includes("happy") ||
        message.includes("excited") ||
        message.includes("great") ||
        message.includes("celebration")
    ) {
        emotion = "Happy";
        riskLevel = "LOW";
        emotionScore = 3;
        return { emotion, riskLevel, emotionScore };
    }

    // 😠 Angry
    if (
        message.includes("angry") ||
        message.includes("frustrated")
    ) {
        emotion = "Angry";
        riskLevel = "MEDIUM";
        emotionScore = -1;
        return { emotion, riskLevel, emotionScore };
    }

    return { emotion, riskLevel, emotionScore };
};

module.exports = analyzeEmotion;
