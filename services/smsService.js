const fetch = require("node-fetch");

const sendSMS = async (phone, message) => {
    try {
        const response = await fetch("https://textbelt.com/text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: phone,
                message: message,
                key: "textbelt"
            })
        });

        const data = await response.json();
        console.log("SMS Response:", data);

    } catch (error) {
        console.error("SMS Error:", error.message);
    }
};

module.exports = sendSMS;